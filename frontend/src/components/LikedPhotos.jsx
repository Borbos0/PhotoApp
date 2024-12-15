import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import "../styles/Gallery.css";
import Pagination from "./Pagination";
import FilterControls from "./FilterControls";

const PHOTOS_PER_PAGE = 10;

const LikedPhotos = () => {
  const [likedPhotos, setLikedPhotos] = useState(() => {
    return JSON.parse(localStorage.getItem("likedPhotos")) || [];
  });
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem("likedPhotos")) || [];
    setLikedPhotos(savedLikes);
    setFilteredPhotos(savedLikes);
  }, []);

  useEffect(() => {
    const filtered = likedPhotos.filter((photo) =>
      photo.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredPhotos(filtered);
    setCurrentPage(1);
  }, [filterText, likedPhotos]);

  const removeLike = (photo, event) => {
    event.stopPropagation();
    const updatedLikedPhotos = likedPhotos.filter(
      (liked) => liked.url !== photo.url
    );
    setLikedPhotos(updatedLikedPhotos);
    setFilteredPhotos(updatedLikedPhotos);
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

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPhoto]);

  const indexOfLastPhoto = currentPage * PHOTOS_PER_PAGE;
  const indexOfFirstPhoto = indexOfLastPhoto - PHOTOS_PER_PAGE;
  const currentPhotos = filteredPhotos.slice(
    indexOfFirstPhoto,
    indexOfLastPhoto
  );

  const totalPages = Math.ceil(filteredPhotos.length / PHOTOS_PER_PAGE);

  return (
    <div>
      <h2>Liked Photos</h2>

      {/* Поиск */}
      <FilterControls
        filterText={filterText}
        onFilterChange={setFilterText}
        sortOption={null}
        onSortChange={() => {}}
      />

      <div className="gallery">
        {currentPhotos.map((photo, index) => (
          <div
            key={index}
            className="photo-item"
            onClick={() => openModal(photo)}
          >
            <img src={photo.url} alt={photo.name} />
            <button
              className="like-button liked"
              onClick={(e) => removeLike(photo, e)}
            >
              Unlike
            </button>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      />

      <Modal photo={selectedPhoto} onClose={closeModal} />
    </div>
  );
};

export default LikedPhotos;
