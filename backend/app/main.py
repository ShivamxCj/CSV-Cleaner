from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import BytesIO
from fastapi.responses import StreamingResponse

app = FastAPI(title="CSV Cleaner API", version="0.0.1")

# ---- CORS Setup ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://csv-cleaner-phi.vercel.app/"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]  # important for filename in downloads
)

@app.get("/")
def root():
    return {"message": "Welcome to CSV Cleaner API"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/upload_csv")
async def upload_csv(file: UploadFile = File(...)):
    """
    Step 1: Receive a CSV from frontend
    """
    try:
        df = pd.read_csv(file.file)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read CSV: {e}")

    return {
        "filename": file.filename,
        "rows": df.shape[0],
        "columns": df.shape[1],
        "columns_list": list(df.columns)
    }

@app.post("/clean")
async def clean_csv(file: UploadFile = File(...)):
    """
    Receive CSV, clean it, and return a downloadable cleaned CSV
    """
    df = await _read_and_clean(file)

    buffer = BytesIO()
    df.to_csv(buffer, index=False)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="text/csv",
        headers={
            "Content-Disposition": f'attachment; filename="cleaned_{file.filename}"',
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

@app.post("/download_xlsx")
async def download_xlsx(file: UploadFile = File(...)):
    """
    Receive CSV, clean it, and return a downloadable Excel file (.xlsx)
    """
    df = await _read_and_clean(file)

    buffer = BytesIO()
    df.to_excel(buffer, index=False, engine='openpyxl')
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f'attachment; filename="cleaned_{file.filename.split(".")[0]}.xlsx"',
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

# ---- Helper function to read and clean CSV ----
async def _read_and_clean(file: UploadFile):
    try:
        df = pd.read_csv(file.file)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read CSV: {e}")

    # Trim column names
    df.columns = df.columns.str.strip()

    # Trim whitespace in string columns
    for col in df.select_dtypes(include=['object']).columns:
        df[col] = df[col].astype(str).str.strip()

    # Remove duplicates
    df = df.drop_duplicates()

    # Fill missing values
    df = df.fillna("")

    return df
