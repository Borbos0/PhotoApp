import { useState, useCallback, useEffect, useRef } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function usePhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const currentPage = useRef(1);
  const loadedPhotosMap = useRef(new Map());

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      
      const url = `${API_BASE_URL}/api/photos?page=${currentPage.current}&limit=20`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.photos?.length) {
        setHasMore(false);
        return;
      }

      if (total === 0) {
        setTotal(data.total);
      }

      const newPhotos = data.photos
        .filter(photo => !loadedPhotosMap.current.has(photo.name))
        .map(photo => {
          const processedPhoto = {
            ...photo,
            url: `${API_BASE_URL}${photo.url}`,
            id: photo.name
          };
          loadedPhotosMap.current.set(photo.name, processedPhoto);
          return processedPhoto;
        });

      if (newPhotos.length === 0) {
        if (loadedPhotosMap.current.size >= data.total) {
          setHasMore(false);
        }
        return;
      }

      setPhotos(prev => [...prev, ...newPhotos]);
      currentPage.current += 1;

    } catch (err) {
      console.error('Error loading photos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [total]);

  useEffect(() => {
    if (!loading && hasMore) {
      fetchPhotos();
    }
  }, [loading, hasMore, fetchPhotos]);

  const resetPhotos = useCallback(() => {
    setPhotos([]);
    currentPage.current = 1;
    loadedPhotosMap.current.clear();
    setHasMore(true);
    setError(null);
    setTotal(0);
  }, []);

  const deletePhotos = useCallback(async (urls) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          files: urls.map(url => url.split('/uploads/')[1])
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete photos');
      }

      setPhotos(prevPhotos => 
        prevPhotos.filter(photo => !urls.includes(photo.url))
      );

      urls.forEach(url => {
        const fileName = url.split('/uploads/')[1];
        loadedPhotosMap.current.delete(fileName);
      });

      setTotal(prev => prev - urls.length);
      return true;
    } catch (error) {
      console.error('Error deleting photos:', error);
      setError(error.message);
      return false;
    }
  }, []);

  return {
    photos,
    loading,
    hasMore,
    error,
    total,
    resetPhotos,
    deletePhotos,
    fetchPhotos
  };
}