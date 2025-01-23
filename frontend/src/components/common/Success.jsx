import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Modal.css";

const SuccessModal = ({ onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
      navigate("/gallery");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-content success-modal">
        <h3>Успешно!</h3>
        <p>Фотографии успешно загружены</p>
        <p>Перенаправление в галерею...</p>
      </div>
    </div>
  );
};

export default SuccessModal;
