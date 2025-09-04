// components/ChapterNavigation.js
import React from "react";
import { FaListUl } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ChapterNavigationTop = ({
  chapters,
  handlePreviousChapter,
  handleNextChapter,
  handleChapterClick,
  showChapters1,
  setShowChapters1,
  isFirstChapter,
  isLastChapter,
  dropdownRef1,
}) => {
  return (
    <div className="flex justify-center items-center mt-5 ml-2">
      {chapters.length > 0 && (
        <div className="flex justify-between items-center pb-4">
          <ul className="flex flex-col font-semibold p-2 md:p-0 border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li
              className={`flex items-center font-thin rounded px-2 py-1 cursor-pointer ${
                isFirstChapter
                  ? "flex items-center rounded px-2 py-1 bg-[#c6c6c6] text-white cursor-text"
                  : "bg-[#7b7b7b] text-white"
              }`}
              onClick={handlePreviousChapter}
            >
              <IoIosArrowBack />
              Chương trước
            </li>
            <li
              className="relative flex items-center rounded px-3 py-3 bg-[#7b7b7b] text-white cursor-pointer"
              ref={dropdownRef1}
              onClick={() => setShowChapters1(!showChapters1)}
            >
              <FaListUl />
              {showChapters1 && (
                <div className="absolute top-full left-0 bg-white border rounded shadow-lg p-4 mt-2 z-50 w-80 max-h-60 text-black">
                  <h2 className="text-lg font-semibold mb-2">Danh sách chương</h2>
                  <ul className="max-h-40 overflow-y-auto font-normal text-sm">
                    {chapters.map((chapter, index) => (
                      <li
                        key={chapter.hashId}
                        className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleChapterClick(chapter.hashId)}
                      >
                        {`Chương ${index + 1}: ${chapter.title}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
            <li
              className={`flex items-center font-thin rounded px-2 py-1 cursor-pointer ${
                isLastChapter
                  ? "flex items-center rounded px-2 py-1 bg-[#c6c6c6] text-white cursor-text"
                  : "bg-[#7b7b7b] text-white"
              }`}
              onClick={handleNextChapter}
            >
              Chương tiếp
              <IoIosArrowForward />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChapterNavigationTop;
