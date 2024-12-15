import React from "react";
import "../styles/Modal.css";

const Modal = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <img src={photo.url} alt={photo.name} className="modal-image" />
        <p className="photo-name">{photo.name}</p>
      </div>
    </div>
  );
};

export default Modal;
