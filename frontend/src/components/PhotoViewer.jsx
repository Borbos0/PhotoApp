import React from "react";

const PhotoViewer = ({ photo, onClose }) => {
  return (
    <div className="photo-viewer">
      <img src={photo.url} alt={photo.name} />
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default PhotoViewer;
