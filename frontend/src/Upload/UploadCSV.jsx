import React, { useState } from "react";
import axios from "axios";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleReset = () => {
    setFile(null);
    setInfo(null);
    document.getElementById("fileInput").value = null;
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        "https://csv-cleaner-cco8.onrender.com/upload_csv",
        formData
      );
      setInfo(res.data);
    } catch (err) {
      console.error(err);
      alert("Error uploading CSV");
    }
  };

  const handleDownloadCSV = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("https://csv-cleaner-cco8.onrender.com/clean", formData, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `cleaned_${file.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Error downloading cleaned CSV");
    }
  };

  const handleDownloadXLSX = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        "https://csv-cleaner-cco8.onrender.com/download_xlsx",
        formData,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `cleaned_${file.name.split(".")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Error downloading Excel file");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 px-4">
      {/* Heading */}
      <h1 className="text-5xl font-extrabold text-blue-400 mb-4 drop-shadow-md">
        CSV Cleaner
      </h1>
      <p className="mb-10 text-center leading-relaxed text-gray-300 w-full max-w-md px-4 text-base sm:text-lg md:text-xl">
        This application cleans raw CSV files and returns clean data in
        <span className="font-semibold text-blue-400"> .csv </span>
        and
        <span className="font-semibold text-blue-400"> .xlsx </span> format.
      </p>
      {/* Card */}
      <div className="w-full max-w-md bg-gray-800 p-8 py-10 rounded-xl shadow-lg border border-gray-700">
        <input
          id="fileInput"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden" // hide the ugly default input
        />

        <label
          htmlFor="fileInput"
          className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition mb-4"
        >
          {file ? `📂 ${file.name}` : "Choose CSV File"}
        </label>

        {/* Download buttons in 2-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-10">
          <button
            onClick={handleDownloadCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            Download Cleaned CSV
          </button>
          <button
            onClick={handleDownloadXLSX}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            Download Excel
          </button>
        </div>

        {/* Preview & Reset buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            Preview CSV Info
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
              <strong>Filename:</strong> {info.filename}
            </p>
            <p>
              <strong>Rows:</strong> {info.rows}
            </p>
            <p>
              <strong>Columns:</strong> {info.columns}
            </p>
            <p>
              <strong>Column Names:</strong> {info.columns_list.join(", ")}
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

        {/* Social Icons */}
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
            href="https://www.linkedin.com/in/shivam-chatterjee-1230b4247?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
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
