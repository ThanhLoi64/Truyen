"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchTopView } from "@/app/api/user";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Header from "@/app/MainPage/Header/Header";
import Footer from "@/app/components/nav/Footer";

const SeriesItem = ({ index, title, imgSrc, href, loading }) => (
  <div className="flex flex-wrap justify-center gap-4 w-full relative">
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
      {index < 3 && (
        <div className="absolute top-0 right-0">
          {loading ? (
            <Skeleton width={34} height={16} />
          ) : (
            <p className="text-xs mx-1  bg-[#FD8383] text-[#ffffff] pt-[1px] px-1">
              HOT
            </p>
          )}
        </div>
      )}
    </div>
  </div>
);

const SingleHotSeriesPage = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 21;

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTopView();
      const sortedData = data.sort((a, b) => b.viewCount - a.viewCount);
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
            GỢI Ý CHO BẠN
          </Link>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 ">
            {loading
              ? Array(itemsPerPage)
                  .fill()
                  .map((_, index) => <SeriesItem key={index} index={index} loading={loading} />)
              : currentPageData.map((series, index) => (
                  <SeriesItem
                    key={series.id}
                    index={index}
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

export default SingleHotSeriesPage;
