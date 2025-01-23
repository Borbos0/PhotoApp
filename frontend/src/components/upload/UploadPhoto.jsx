import React, { useState, useCallback } from "react";
import SuccessModal from "../common/Success";
import ConfirmModal from "../common/Confirm";
import "../../styles/UploadPhoto.css";

const UploadPhotos = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleFiles = useCallback((files) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      imageFiles.forEach((file) => {
        if (!prev.some((f) => f.name === file.name)) {
          newFiles.push(file);
        }
      });
      return newFiles;
    });
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFileChange = (e) => handleFiles(e.target.files);

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
    if (selectedFiles.length > 0) {
      setShowUploadConfirm(true);
    }
  };

  const handleConfirmUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("photos", file));

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSelectedFiles([]);
        setShowUploadConfirm(false);
        setShowSuccessModal(true);
        if (onUploadSuccess) onUploadSuccess();
      } else {
        throw new Error("Failed to upload photos");
      }
    } catch (err) {
      console.error("Error uploading photos:", err);
      alert("An error occurred while uploading the photos");
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Photos</h2>
      <div
        className={`drop-zone ${isDragActive ? "drag-active" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <p>Drag and drop photos here or click to select files</p>
      </div>

      {selectedFiles.length > 0 && (
        <>
          <div className="preview-grid">
            {selectedFiles.map((file, index) => (
              <div className="preview-item" key={index}>
                <img src={URL.createObjectURL(file)} alt={file.name} />
                <button onClick={() => removeFile(index)}>×</button>
              </div>
            ))}
          </div>

          <button
            className="upload-button"
            onClick={handleUploadClick}
            disabled={selectedFiles.length === 0}
          >
            Upload {selectedFiles.length}{" "}
            {selectedFiles.length === 1 ? "Photo" : "Photos"}
          </button>
        </>
      )}

      {showUploadConfirm && (
        <ConfirmModal
          message={`Вы уверены, что хотите загрузить ${selectedFiles.length} ${
            selectedFiles.length === 1 ? "фотографию" : "фотографий"
          }?`}
          onConfirm={handleConfirmUpload}
          onCancel={() => setShowUploadConfirm(false)}
        />
      )}

      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  );
};

export default UploadPhotos;
