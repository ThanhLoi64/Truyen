"use client";
import React, { useState, useEffect, useRef } from "react";
import Footer from "../../components/nav/Footer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import "./style.css";
import ChapterNavigationTop from "./ChapterNavigationTop";
import ChapterNavigation from "./ChapterNavigationBottom";
import useReadingPage from "./useReadingPage";
import SettingsMenu from "./SettingsMenu";
import Spiner from "./Spiner";
import { MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";

const ReadingPage = () => {
  const {
    hashId,
    chapters,
    bottomChapters,
    selectedChapterId,
    selectedChapterDetail,
    showChapters1,
    showChapters2,
    dropdownRef1,
    dropdownRef2,
    handleChapterClick,
    handlePreviousChapter,
    handleNextChapter,
    setShowChapters1,
    setShowChapters2,
  } = useReadingPage(null);

  const [fontSize, setFontSize] = useState(25);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fontFamily, setFontFamily] = useState("'Palatino Linotype', serif");
  const [isVisible, setIsVisible] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!hashId) {
    return (
      <Spiner/>
    );
  }

  const currentIndex = chapters.findIndex(
    (chapter) => chapter.hashId === selectedChapterId
  );
  const isFirstChapter = currentIndex === 0;
  const isLastChapter = currentIndex === chapters.length - 1;

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-[#101013] text-[#FAFAFA]" : "bg-[#F8F7F4] text-black"}`}
    >
      <nav
        className={` border-gray-200 dark:bg-gray-900 dark:border-gray-700 shadow-xl sticky z-50 mt-16 ${
          isDarkMode
            ? "bg-[#19191d] text-white shadow-md shadow-[#000000]"
            : "bg-[#EEEDEB] text-black"
        }`}
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-3 relative z-50">
          <div
            className="hidden w-full md:block md:w-auto px-10 relative"
            id="navbar-dropdown"
          >
            <div className="flex justify-between items-center">
              <ul className="flex flex-col font-semibold p-2 md:p-0 border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li className="flex items-center rounded px-2 py-1">
                  <div className="mx-64 text-2xl font-medium">
                    {selectedChapterId
                      ? `Chương ${currentIndex + 1}: ${
                          chapters.find(
                            (chapter) => chapter.hashId === selectedChapterId
                          )?.title
                        }`
                      : ""}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <SettingsMenu 
        fontSize={fontSize} 
        setFontSize={setFontSize}
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        fontFamily={fontFamily} 
        setFontFamily={setFontFamily}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={toggleDropdown}
      />

      <div className="flex flex-col min-h-screen">
        <div className="flex-grow pt-5 px-48 font-san text-xl flex justify-start items-center w-full flex-col">
          <ChapterNavigationTop
            chapters={chapters}
            handlePreviousChapter={handlePreviousChapter}
            handleNextChapter={handleNextChapter}
            handleChapterClick={handleChapterClick}
            showChapters1={showChapters1}
            setShowChapters1={setShowChapters1}
            isFirstChapter={isFirstChapter}
            isLastChapter={isLastChapter}
            dropdownRef1={dropdownRef1}
          />
          <div className="flex w-full">
            <div id="body" className="flex-grow text-left px-2">
              {selectedChapterDetail ? (
                <div
                  style={{
                    fontFamily: fontFamily,
                    fontSize: `${fontSize}px`,
                    lineHeight: "2",
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      ul: ({ children }) => <div>{children}</div>,
                      li: ({ children }) => <p>{children}</p>,
                    }}
                  >
                    {selectedChapterDetail.body
                      .replace(/\t/g, " ")
                      .replace(/\n\n/g, "\n\n")
                      .replace(/\n/g, "<br />")
                      .replace(/-/g, "\\-")}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-center italic">Truyện chưa có chương</p>
              )}
            </div>
          </div>
        </div>
        <ChapterNavigation
          isFirstChapter={isFirstChapter}
          isLastChapter={isLastChapter}
          handlePreviousChapter={handlePreviousChapter}
          handleNextChapter={handleNextChapter}
          bottomChapters={bottomChapters}
          handleChapterClick={handleChapterClick}
          showChapters2={showChapters2}
          setShowChapters2={setShowChapters2}
          dropdownRef2={dropdownRef2}
        />
        <Footer />
      </div>
      {isVisible && (
        <button
          className="fixed bottom-5 items-center justify-center right-5 bg-[#7B7B7B] text-white p-2 rounded"
          onClick={scrollToTop}
        >
         <MdOutlineKeyboardDoubleArrowUp size={30} />
        </button>
      )}
    </div>
  );
};

export default ReadingPage;
