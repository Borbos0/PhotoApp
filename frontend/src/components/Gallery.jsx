import React, { useState, useEffect } from "react";
import "../styles/Gallery.css";
import usePhotos from "../hooks/usePhotos";
import Modal from "./Modal";
import UploadPhoto from "./UploadPhoto";
import PhotoItem from "./PhotoItem";
import Pagination from "./Pagination";
import FilterControls from "./FilterControls";

const PHOTOS_PER_PAGE = 15;

const Gallery = () => {
  const { photos, fetchPhotos, deletePhotos } = usePhotos(); // Добавлено deletePhotos
  const [likedPhotos, setLikedPhotos] = useState(
    () => JSON.parse(localStorage.getItem("likedPhotos")) || []
  );
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]); // Выбранные фото для удаления
  const [currentPage, setCurrentPage] = useState(1);

  // filter
  const [filterText, setFilterText] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");

  const filteredPhotos = photos.filter((photo) =>
    photo.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    if (sortOption === "name-asc") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "name-desc") {
      return b.name.localeCompare(a.name);
    } else if (sortOption === "date-asc") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortOption === "date-desc") {
      return new Date(b.date) - new Date(a.date);
    }
    return 0;
  });

  const indexOfLastPhoto = currentPage * PHOTOS_PER_PAGE;
  const indexOfFirstPhoto = indexOfLastPhoto - PHOTOS_PER_PAGE;
  const currentPhotos = sortedPhotos.slice(indexOfFirstPhoto, indexOfLastPhoto);

  const totalPages = Math.ceil(sortedPhotos.length / PHOTOS_PER_PAGE);

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

  const toggleLike = (photo, event) => {
    event.stopPropagation();
    let updatedLikedPhotos;
    if (likedPhotos.find((liked) => liked.url === photo.url)) {
      updatedLikedPhotos = likedPhotos.filter(
        (liked) => liked.url !== photo.url
      );
    } else {
      updatedLikedPhotos = [...likedPhotos, photo];
    }
    setLikedPhotos(updatedLikedPhotos);
    localStorage.setItem("likedPhotos", JSON.stringify(updatedLikedPhotos));
  };

  const handleCheckboxChange = (photo) => {
    setSelectedPhotos((prevSelected) =>
      prevSelected.includes(photo)
        ? prevSelected.filter((p) => p !== photo)
        : [...prevSelected, photo]
    );
  };

  const handleDelete = async () => {
    if (selectedPhotos.length === 0) {
      alert("Please select photos to delete.");
      return;
    }

    const photoUrlsToDelete = selectedPhotos.map((photo) => photo.url);
    await deletePhotos(photoUrlsToDelete); // Вызываем метод удаления из usePhotos
    setSelectedPhotos([]); // Сбрасываем выбранные фотографии
  };

  const openModal = (photo) => {
    if (!showCheckboxes) {
      setSelectedPhoto(photo);
    }
  };

  const closeModal = () => setSelectedPhoto(null);

  return (
    <div>
      <h2>Gallery</h2>
      <UploadPhoto onUploadSuccess={fetchPhotos} />

      <FilterControls
        filterText={filterText}
        onFilterChange={setFilterText}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      <button
        onClick={() => {
          setShowCheckboxes(!showCheckboxes);
          setSelectedPhotos([]);
        }}
      >
        {showCheckboxes ? "Hide Checkboxes" : "Show Checkboxes"}
      </button>
      {showCheckboxes && selectedPhotos.length > 0 && (
        <button onClick={handleDelete}>Delete Selected</button>
      )}
      <div className="gallery">
        {currentPhotos.map((photo) => (
          <PhotoItem
            key={photo.url}
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

export default Gallery;
