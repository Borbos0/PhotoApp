import React from "react";

const Pagination = ({ currentPage, totalPages, onPrevious, onNext }) => (
  <div className="pagination">
    <button onClick={onPrevious} disabled={currentPage === 1}>
      Previous
    </button>
    <span>
      Page {currentPage} of {totalPages}
    </span>
    <button onClick={onNext} disabled={currentPage === totalPages}>
      Next
    </button>
  </div>
);

export default Pagination;
