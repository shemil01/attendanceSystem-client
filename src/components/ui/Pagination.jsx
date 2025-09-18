import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
 <div className="flex flex-col md:flex-row items-center justify-between mt-4 text-sm manrope-font">
      <p className="text-gray-600 mb-2 md:mb-0">
        Showing page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center space-x-2">
        <button
          className={`px-3 py-1 rounded-lg  flex items-center font-bold custom-font ${
            currentPage === 1 ? "text-gray-400" : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <ChevronLeft />  Previous
        </button>
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === page ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2 text-gray-500">
              {page}
            </span>
          )
        )}

        <button
          className={`px-3 py-1 rounded-lg flex items-center font-bold ${
            currentPage === totalPages ? "text-gray-400" : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;