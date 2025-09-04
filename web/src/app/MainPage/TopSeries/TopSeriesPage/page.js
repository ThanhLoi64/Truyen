"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchTopSeries } from "@/app/api/user";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { IoIosArrowForward } from "react-icons/io";
import Header from "../../Header/Header";
import Footer from "@/app/components/nav/Footer";

const SeriesItem = ({ title, imgSrc, href, loading }) => (
    
<div className="flex flex-wrap justify-center gap-4 w-full">
    <div className="transform transition-transform duration-200 hover:scale-105 group">
      {loading ? (
        <Skeleton
          width={155}
          height={256}
          className="w-[155px] h-64 object-cover rounded shadow-lg"
        />
      ) : (
        <Link href={href}>
          <img
            src={imgSrc}
            alt={title}
            className="w-[155px] h-64 object-cover rounded shadow-lg cursor-pointer"
          />
          <p className="absolute bottom-0 left-0 right-0 text-center rounded-b-[0.5rem] text-lg font-medium text-white bg-gray-900 bg-opacity-70">
            {title}
          </p>
        </Link>
      )}
    </div>
  </div>
  
);

const TopSeriesPage = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 21;

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTopSeries();
      const sortedData = data.sort((a, b) => b.voteCount - a.voteCount);
      setSeriesData(sortedData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 mx-1 border rounded ${
            i === currentPage ? "bg-[--button] text-white" : "bg-white text-blue-500"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const offset = (currentPage - 1) * itemsPerPage;
  const currentPageData = seriesData.slice(offset, offset + itemsPerPage);
  const totalPages = Math.ceil(seriesData.length / itemsPerPage);

  return (
    <div className="flex flex-col min-h-screen">
     <Header />
 <div className="flex-grow pt-5 flex justify-start items-center w-full flex-col">
     
      <div className="ml-10 my-5 px-20">
        <Link
          href="#"
          className="items-center flex text-2xl font-semi mb-4 underline decoration-[1px] underline-offset-2 cursor-pointer"
        >
          TOP BÌNH CHỌN
        </Link>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 ">
          {loading
            ? Array(itemsPerPage)
                .fill()
                .map((_, index) => <SeriesItem key={index} loading={loading} />)
            : currentPageData.map((series) => (
                <SeriesItem
                  key={series.id}
                  title={series.title}
                  imgSrc={series.coverImg.url}
                  href={`/Novel/SingleSeriesPage?hashId=${series.hashId}`}
                  loading={loading}
                />
              ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handlePreviousPage}
              className={`px-3 py-1 mx-1 border rounded ${
                currentPage === 1 ? "bg-gray-300 cursor-default" : "bg-white text-blue-500"
              }`}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            {renderPageNumbers()}
            <button
              onClick={handleNextPage}
              className={`px-3 py-1 mx-1 border rounded ${
                currentPage === totalPages ? "bg-gray-300 cursor-default" : "bg-white text-blue-500"
              }`}
              disabled={currentPage === totalPages}
            >
              Sau
            </button>
          </div>
        )}
      </div>
     
    </div>
    <Footer />
    </div>
   
  );
};

export default TopSeriesPage;
