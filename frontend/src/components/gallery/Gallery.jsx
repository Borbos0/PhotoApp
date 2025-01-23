import React, { useState, useEffect } from "react";
import "../../styles/Gallery.css";
import usePhotos from "../../hooks/usePhotos";
import Modal from "../common/Modal";
import PhotoItem from "../common/PhotoItem";
import ConfirmModal from "../common/Confirm";

const Gallery = () => {
  const { photos, loading, deletePhotos, total } = usePhotos();
  const [likedPhotos, setLikedPhotos] = useState(
    () => JSON.parse(localStorage.getItem("likedPhotos")) || []
  );
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && selectedPhoto) {
        setSelectedPhoto(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto]);

  const handleDeleteClick = () => {
    if (selectedPhotos.length > 0) {
      setShowDeleteConfirm(true);
    }
  };

  const handleConfirmDelete = async () => {
    const selectedUrls = selectedPhotos.map((photo) => photo.url);
    await deletePhotos(selectedUrls);
    setSelectedPhotos([]);
    setShowCheckboxes(false);
    setShowDeleteConfirm(false);
  };

  const toggleLike = (photo, e) => {
    e.stopPropagation();
    setLikedPhotos((prevLikedPhotos) => {
      const isLiked = prevLikedPhotos.find((liked) => liked.url === photo.url);
      const updatedLikedPhotos = isLiked
        ? prevLikedPhotos.filter((liked) => liked.url !== photo.url)
        : [...prevLikedPhotos, photo];

      localStorage.setItem("likedPhotos", JSON.stringify(updatedLikedPhotos));
      return updatedLikedPhotos;
    });
  };

  const handleCheckboxChange = (photo) => {
    setSelectedPhotos((prevSelected) =>
      prevSelected.includes(photo)
        ? prevSelected.filter((p) => p !== photo)
        : [...prevSelected, photo]
    );
  };

  const openModal = (photo) => {
    if (!showCheckboxes) {
      setSelectedPhoto(photo);
    }
  };

  const closeModal = () => setSelectedPhoto(null);

  return (
    <div>
      <h2>
        Gallery ({photos.length} of {total} photos)
      </h2>
      <div className="gallery-actions">
        <button
          onClick={() => setShowCheckboxes(!showCheckboxes)}
          className={`select-mode-button ${showCheckboxes ? "active" : ""}`}
        >
          {showCheckboxes ? "Cancel Selection" : "Select Photos"}
        </button>

        {showCheckboxes && selectedPhotos.length > 0 && (
          <button onClick={handleDeleteClick} className="delete-button">
            Delete Selected ({selectedPhotos.length})
          </button>
        )}
      </div>

      <div className="gallery">
        {photos.map((photo, index) => (
          <PhotoItem
            key={photo.id || `${photo.name}-${index}`}
            photo={photo}
            onClick={() => openModal(photo)}
            showCheckboxes={showCheckboxes}
            isSelected={selectedPhotos.includes(photo)}
            onCheckboxChange={() => handleCheckboxChange(photo)}
            isLiked={likedPhotos.find((liked) => liked.url === photo.url)}
            onLikeToggle={(e) => toggleLike(photo, e)}
          />
        ))}
      </div>

      {loading && (
        <div className="loading">
          <div className="loading-spinner" />
          Loading photos... ({photos.length} of {total})
        </div>
      )}

      <Modal photo={selectedPhoto} onClose={closeModal} />

      {showDeleteConfirm && (
        <ConfirmModal
          message={`Вы уверены, что хотите удалить ${selectedPhotos.length} ${
            selectedPhotos.length === 1 ? "фотографию" : "фотографий"
          }?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default Gallery;
