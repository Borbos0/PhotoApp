import React, { useEffect } from "react";
import "../../styles/Modal.css";

const Modal = ({ photo, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (!photo) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="nav-button left" onClick={onPrev}>
          &#8592;
        </button>
        <img src={photo.url} alt={photo.name} className="modal-image" />
        <button className="nav-button right" onClick={onNext}>
          &#8594;
        </button>
        <p className="photo-name">{photo.name}</p>
      </div>
    </div>
  );
};

export default Modal;
