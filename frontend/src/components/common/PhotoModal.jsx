import React from "react";
import Modal from "./Modal";

const PhotoModal = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <Modal onClose={onClose} className="photo-modal">
      <img src={photo.url} alt={photo.name} className="modal-image" />
      <p className="photo-name">{photo.name}</p>
    </Modal>
  );
};

export default PhotoModal;
