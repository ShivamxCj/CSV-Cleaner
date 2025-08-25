import React, { useState } from "react";
import axios from "axios";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setInfo(null); // reset info when new file selected
  };

  // Reset everything
  const handleReset = () => {
    setFile(null);
    setInfo(null);
    document.getElementById("fileInput").value = null;
  };

  // Axios instance with base URL
  const api = axios.create({
    baseURL: "https://csv-cleaner-cco8.onrender.com",
    withCredentials: false,
  });

  // Upload CSV to preview info
  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload_csv", formData);
      setInfo(res.data);
    } catch (err) {
      console.error(err);
      alert("Error uploading CSV");
    } finally {
      setLoading(false);
    }
  };

  // Download CSV or XLSX
  const handleDownload = async (endpoint) => {
    if (!file) return alert("Please select a file");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(endpoint, formData, { responseType: "blob" });

      const blob = new Blob([res.data], {
        type:
          endpoint === "/download_xlsx"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "text/csv",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        endpoint === "/download_xlsx"
          ? `cleaned_${file?.name?.split(".")[0]}.xlsx`
          : `cleaned_${file?.name}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error downloading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 px-4">
      <h1 className="text-5xl font-extrabold text-blue-400 mb-4 drop-shadow-md">
        CSV Cleaner
      </h1>
      <p className="mb-10 text-center leading-relaxed text-gray-300 w-full max-w-md px-4 text-base sm:text-lg md:text-xl">
        Clean raw CSV files and get output in{" "}
        <span className="font-semibold text-blue-400">.csv</span> and{" "}
        <span className="font-semibold text-blue-400">.xlsx</span> format.
      </p>

      <div className="w-full max-w-md bg-gray-800 p-8 py-10 rounded-xl shadow-lg border border-gray-700">
        <input
          id="fileInput"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition mb-4"
        >
          {file?.name ? `📂 ${file.name}` : "Choose CSV File"}
        </label>

        {/* Download Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <button
            disabled={!file || loading}
            onClick={() => handleDownload("/clean")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
          >
            Download Cleaned CSV
          </button>
          <button
            disabled={!file || loading}
            onClick={() => handleDownload("/download_xlsx")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
          >
            Download Excel
          </button>
        </div>

        {/* Preview & Reset */}
        <div className="flex flex-col gap-3 mt-4">
          <button
            disabled={!file || loading}
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Preview CSV Info"}
          </button>
          <button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition"
          >
            Reset
          </button>
        </div>

        {/* Info Preview */}
        {info && (
          <div className="bg-gray-700 p-4 rounded-lg mt-5 text-left shadow-inner border border-gray-600">
            <p>
              <strong>Filename:</strong> {info?.filename || ""}
            </p>
            <p>
              <strong>Rows:</strong> {info?.rows ?? ""}
            </p>
            <p>
              <strong>Columns:</strong> {info?.columns ?? ""}
            </p>
            <p>
              <strong>Column Names:</strong>{" "}
              {info?.columns_list?.join(", ") || ""}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-24 text-center text-gray-400">
        <p>
          Made by <strong className="text-gray-200">Shivam Chatterjee</strong> |{" "}
          <a
            href="https://shivamcj.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Portfolio
          </a>
        </p>
        <div className="flex justify-center gap-6 mt-3">
          <a
            href="https://github.com/ShivamxCj"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <FaGithub size={22} />
          </a>
          <a
            href="https://www.instagram.com/sivm_cj?igsh=N290N2U4ZHo5dW1n"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <FaInstagram size={22} />
          </a>
          <a
            href="https://www.linkedin.com/in/shivam-chatterjee-1230b4247"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <FaLinkedin size={22} />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default UploadCSV;
