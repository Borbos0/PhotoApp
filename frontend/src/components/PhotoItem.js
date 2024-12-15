import React from "react";

const PhotoItem = ({
  photo,
  onClick,
  showCheckboxes,
  isSelected,
  onCheckboxChange,
  isLiked,
  onLikeToggle,
}) => (
  <div className="photo-item" onClick={onClick}>
    {showCheckboxes && (
      <input
        type="checkbox"
        className="photo-checkbox"
        checked={isSelected}
        onChange={onCheckboxChange}
      />
    )}
    <img src={photo.url} alt={photo.name} />
    <button
      className={`like-button ${isLiked ? "liked" : ""}`}
      onClick={onLikeToggle}
    >
      {isLiked ? "Unlike" : "Like"}
    </button>
  </div>
);

export default PhotoItem;
