import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:5000";

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

  return { photos, fetchPhotos };
}
