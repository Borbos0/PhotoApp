import { useState, useEffect } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function usePhotos() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = () => {
    fetch(`${API_BASE_URL}/api/photos`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const updatedPhotos = data.map((photo) => ({
          ...photo,
          url: `${API_BASE_URL}${photo.url}`,
        }));
        setPhotos(updatedPhotos);
      })
      .catch((err) => console.error("Error loading photos:", err));
  };

  const deletePhotos = async (photoUrls) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files: photoUrls }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      setPhotos((prevPhotos) =>
        prevPhotos.filter((photo) => !photoUrls.includes(photo.url))
      );
    } catch (error) {
      console.error("Error deleting photos:", error);
    }
  };

  return { photos, fetchPhotos, deletePhotos };
}
