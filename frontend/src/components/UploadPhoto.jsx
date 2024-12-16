import React, { useState } from "react";

const UploadPhoto = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const uploadedFiles = await response.json();
        console.log("Uploaded files:", uploadedFiles);
        alert("Photos uploaded successfully!");
        setSelectedFiles([]);
        onUploadSuccess();
      } else {
        alert("Failed to upload photos.");
      }
    } catch (err) {
      console.error("Error uploading photos:", err);
      alert("An error occurred while uploading the photos.");
    }
  };

  return (
    <div>
      <h2>Upload Photos</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        <button type="submit">Upload</button>
      </form>
      {selectedFiles.length > 0 && (
        <div>
          <h3>Selected Files:</h3>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadPhoto;
