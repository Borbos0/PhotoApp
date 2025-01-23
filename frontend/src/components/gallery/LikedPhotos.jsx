import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import "../../styles/Gallery.css";

const LikedPhotos = () => {
  const [likedPhotos, setLikedPhotos] = useState(() => {
    return JSON.parse(localStorage.getItem("likedPhotos")) || [];
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem("likedPhotos")) || [];
    setLikedPhotos(savedLikes);
  }, []);

  const removeLike = (photo, event) => {
    event.stopPropagation();
    const updatedLikedPhotos = likedPhotos.filter(
      (liked) => liked.url !== photo.url
    );
    setLikedPhotos(updatedLikedPhotos);
    localStorage.setItem("likedPhotos", JSON.stringify(updatedLikedPhotos));
  };

  const openModal = (photo) => setSelectedPhoto(photo);
  const closeModal = () => setSelectedPhoto(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && selectedPhoto) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto]);

  return (
    <div>
      <h2>Liked Photos ({likedPhotos.length})</h2>

      <div className="gallery">
        {likedPhotos.map((photo, index) => (
          <div
            key={photo.id || index}
            className="photo-item"
            onClick={() => openModal(photo)}
          >
            <img src={photo.url} alt={photo.name || "Photo"} />
            <button
              className="like-button liked"
              onClick={(e) => removeLike(photo, e)}
            >
              Unlike
            </button>
          </div>
        ))}
      </div>

      <Modal photo={selectedPhoto} onClose={closeModal} />
    </div>
  );
};

export default LikedPhotos;
