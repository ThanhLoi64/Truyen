// ChapterNavigation.js
import React from "react";
import { FaListUl } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ChapterNavigation = ({
  isFirstChapter,
  isLastChapter,
  handlePreviousChapter,
  handleNextChapter,
  bottomChapters= [],
  handleChapterClick,
  showChapters2,
  setShowChapters2,
  dropdownRef2,
}) => {
  return (
    <div className="flex justify-center items-center mt-5 ml-[9px] ">
      {bottomChapters.length > 0 && (
        <div className="ml-[0.5px]">
          <ul className="flex flex-col font-semibold text-xl md:p-0 border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li
              className={`flex items-center font-thin rounded pr-2 pl-2 py-2 cursor-pointer ${
                isFirstChapter
                  ? "flex items-center rounded pr-2 pl-2 py-2 bg-[#c6c6c6] text-white cursor-text"
                  : "bg-[#7b7b7b] text-white"
              }`}
              onClick={handlePreviousChapter}
            >
              <IoIosArrowBack />
              Chương trước
            </li>
            <li
              className="relative flex items-center rounded px-3 py-3 bg-[#7b7b7b] text-white cursor-pointer"
              ref={dropdownRef2}
              onClick={() => setShowChapters2(!showChapters2)}
            >
              <FaListUl />
              {showChapters2 && (
                <div className="absolute top-full left-0 bg-white border rounded shadow-lg p-4 mt-2 z-50 w-80 max-h-56 text-black">
                  <h2 className="text-lg font-semibold mb-2">Danh sách chương</h2>
                  <ul className="max-h-40 overflow-y-auto font-normal text-sm">
                    {bottomChapters.map((chapter, index) => (
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
              className={`flex items-center font-thin rounded pl-3 pr-2 py-2 cursor-pointer mr-16 ${
                isLastChapter
                  ? "flex items-center rounded bg-[#c6c6c6] text-white cursor-text"
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

export default ChapterNavigation;
