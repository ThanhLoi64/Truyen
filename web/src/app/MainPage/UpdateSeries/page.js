"use client";
import React, { useEffect, useState } from "react";
import { listBookUpdateNovels } from "@/app/api/user";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'; 

const UpdateSeriesPage = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 21;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allData = [];
        let page = 1;
        let data;
        do {
          data = await listBookUpdateNovels(page);
          if (data && data.items) {
            allData.push(...data.items);
          }
          page++;
        } while (data && data.items && data.items.length > 0);

        setSeriesData(allData);
        setTotalPages(Math.ceil(allData.length / itemsPerPage));
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const paginatedData = seriesData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 4) {
        pages.push("...");
      }
      for (
        let i = Math.max(2, currentPage - 2);
        i <= Math.min(totalPages - 1, currentPage + 2);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages.map((page, index) => (
      <button
        key={index}
        onClick={() => typeof page === "number" && handlePageChange(page)}
        className={`px-3 py-1 mx-1 border rounded ${currentPage === page ? "bg-[--button] text-white" : "bg-white text-blue-500"}`}
        disabled={typeof page !== "number"}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className="mb-5">
      <h1 className="text-2xl font-semi mb-4 underline decoration-[1px] underline-offset-2">TRUYỆN MỚI CẬP NHẬT</h1>
      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {Array(21).fill().map((_, index) => (
            <div key={index} className="relative group">
              <Skeleton 
                className="w-[155px] h-64 object-cover rounded-xl shadow-lg" 
                style={{ width: '155px', height: '256px' }}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          {seriesData.length === 0 ? (
            <p className="text-center italic text-gray-400">Không có truyện</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {paginatedData.map((series) => (
                <div key={series.id} className="relative group">
                  <div className="transform transition-transform duration-200 group-hover:scale-105">
                    <Link href={`/Novel/SingleSeriesPage?hashId=${series.hashId}`}>
                      <div className="relative">
                        <img
                          src={series.thumbnailImg.url}
                          alt={series.title}
                          className="w-[155px] h-64 object-cover rounded shadow-lg cursor-pointer"
                        />
                        {series.isCompleted && (
                          <img
                            src="https://static.8cache.com/img/full-label.png" 
                            alt="FULL"
                            className="z-10 absolute -top-9 -left-[8px] w-10 h-auto"
                            style={{ transform: 'translateY(50%)' }} 
                          />
                          
                        )}
                        <p className="z-0 absolute bottom-0 left-0 right-0 text-center rounded-b-[0.5rem] text-lg font-medium text-white bg-gray-900 bg-opacity-70">
                        {series.title}
                      </p>
                      </div>
                     
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handlePreviousPage}
            className={`px-3 py-1 mx-1 border rounded ${currentPage === 1 ? "bg-gray-300 cursor-default" : "bg-white text-blue-500"}`}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          {renderPageNumbers()}
          <button
            onClick={handleNextPage}
            className={`px-3 py-1 mx-1 border rounded ${currentPage === totalPages ? "bg-gray-300 cursor-default " : "bg-white text-blue-500"}`}
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateSeriesPage;
