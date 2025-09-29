import React from "react";
import type { PaginationProps } from "./types"; 


const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  // Generate array of pages
  const getPageNumbers = () => {
    const pages: number[] = [];
    // const maxPagesToShow = 5;
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200">
      
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border rounded-lg px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}


      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className={`px-3 py-1 rounded-lg border ${
            page === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          Prev
        </button>

        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-3 py-1 rounded-lg border ${
              num === page
                ? "bg-blue-500 text-black"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className={`px-3 py-1 rounded-lg border ${
            page === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          Next
        </button>
      </div>

      {/* Page Info */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span>-
        <span className="font-medium">
          {Math.min(page * pageSize, totalCount)}
        </span>{" "}
        of <span className="font-medium">{totalCount}</span>
      </div>
    </div>
  );
};

export default Pagination;
