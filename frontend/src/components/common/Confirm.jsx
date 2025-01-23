import React from "react";
import "../../styles/Modal.css";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content confirm-modal">
        <h3>Подтверждение</h3>
        <p>{message}</p>
        <div className="confirm-buttons">
          <button className="confirm-button confirm" onClick={onConfirm}>
            Подтвердить
          </button>
          <button className="confirm-button cancel" onClick={onCancel}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
