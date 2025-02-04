import React, { useEffect, useState } from "react";
import usePhotos from "../../hooks/usePhotos";
import "../../styles/RandomPhoto.css";

const RandomPhoto = () => {
  const { photos, loading } = usePhotos();
  const [currentPhoto, setCurrentPhoto] = useState(null);

  useEffect(() => {
    if (photos.length === 0) return;

    const changePhoto = () => {
      const randomIndex = Math.floor(Math.random() * photos.length);
      setCurrentPhoto(photos[randomIndex]);
    };

    changePhoto();
    const interval = setInterval(changePhoto, 5000);

    return () => clearInterval(interval);
  }, [photos]);

  if (loading) return <p>Loading...</p>;
  if (!currentPhoto) return <p>No photos available</p>;

  return (
    <div className="random-photo-container">
      <img
        src={currentPhoto.url}
        alt={currentPhoto.name}
        className="random-photo"
      />
    </div>
  );
};

export default RandomPhoto;
