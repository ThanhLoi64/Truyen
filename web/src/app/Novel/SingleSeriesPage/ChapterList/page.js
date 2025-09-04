"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchChapterListBottom } from "@/app/api/web";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { IoMdBookmarks } from "react-icons/io";

const ChapterList = () => {
  const [hashId, setHashId] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const chaptersPerPage = 15;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const query = new URLSearchParams(window.location.search);
      const hashIdFromQuery = query.get("hashId");
      setHashId(hashIdFromQuery);

      const fetchData = async (hashId) => {
        try {
          const chaptersData = await fetchChapterListBottom(hashId);
          setChapters(chaptersData);
        } catch (error) {
          console.error("Error fetching chapters:", error);
        }
      };

      if (hashIdFromQuery) {
        fetchData(hashIdFromQuery);
      }
    }
  }, [hashId]);

  const totalPages = Math.ceil(chapters.length / chaptersPerPage);
  const startIndex = (currentPage - 1) * chaptersPerPage;
  const endIndex = startIndex + chaptersPerPage;
  const currentChapters = chapters.slice(startIndex, endIndex);

  const columns = [[], [], []];
  currentChapters.forEach((chapter, index) => {
    columns[index % 3].push({ ...chapter, number: startIndex + index + 1 });
  });

  const handleChapterClick = (chapterId) => {
    const url = new URL(window.location);
    url.searchParams.set("chapterHashId", chapterId);
    window.history.replaceState({}, '', url);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 mx-1 border rounded ${currentPage === i ? "bg-[--button] text-white" : "bg-white text-blue-500"}`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex-grow flex flex-col items-center w-full">
      <div className="w-full flex justify-start mb-4 ps-24">
      </div>

      <div className="flex gap-4">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="max-w-full w-[430px]">
            {column.map((chapter) => (
              <Link
                key={chapter.hashId}
                href={`../Novel/ReadingPage?hashId=${hashId}&chapterHashId=${chapter.hashId}`}
                className="flex justify-start ps-2 rounded h-8 text-sm items-center mt-2 py-1 gap-1 bg-gray-200 sm:mb-0 hover:bg-gray-300 transform transition-transform duration-200"
                onClick={() => handleChapterClick(chapter.hashId)}
              >
                <IoMdBookmarks />
                {`Chương ${chapter.number}: ${chapter.title}`}
              </Link>
            ))}
          </div>
        ))}
      </div>
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
            className={`px-3 py-1 mx-1 border rounded ${currentPage === totalPages ? "bg-gray-300 cursor-default" : "bg-white text-blue-500"}`}
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ChapterList;
