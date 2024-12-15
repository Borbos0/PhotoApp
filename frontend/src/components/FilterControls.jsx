import React from "react";

const FilterControls = ({
  filterText,
  onFilterChange,
  sortOption,
  onSortChange,
}) => {
  return (
    <div className="controls">
      <input
        type="text"
        placeholder="Search photos..."
        value={filterText}
        onChange={(e) => onFilterChange(e.target.value)}
      />
      <select value={sortOption} onChange={(e) => onSortChange(e.target.value)}>
        <option value="name-asc">Sort by name (A-Z)</option>
        <option value="name-desc">Sort by name (Z-A)</option>
        <option value="date-asc">Sort by date (oldest)</option>
        <option value="date-desc">Sort by date (newest)</option>
      </select>
    </div>
  );
};

export default FilterControls;
