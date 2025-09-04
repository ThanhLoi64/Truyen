import { useEffect, useState, useRef } from "react";
import {
  fetchChapterList,
  fetchChapterDetail,
  fetchChapterListBottom,
  fetchView,
} from "@/app/api/web";

const useReadingPage = (initialId) => {
  const [hashId, setHashId] = useState(initialId);
  const [chapters, setChapters] = useState([]);
  const [bottomChapters, setBottomChapters] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedChapterDetail, setSelectedChapterDetail] = useState(null);
  const [showChapters1, setShowChapters1] = useState(false);
  const [showChapters2, setShowChapters2] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null); 
  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const query = new URLSearchParams(window.location.search);
      const idFromQuery = query.get("hashId");
      const chapterIdFromQuery = query.get("chapterHashId");
      setHashId(idFromQuery);
      setSelectedChapterId(chapterIdFromQuery);
    }
  }, []);

  useEffect(() => {
    if (hashId) {
      const getChapters = async () => {
        try {
          const chapterData = await fetchChapterList(hashId);
          setChapters(chapterData);
          if (chapterData.length > 0 && !selectedChapterId) {
            setSelectedChapterId(chapterData[0].hashId);
          }
        } catch (error) {
          console.error("Error fetching chapters:", error);
        }
      };
      getChapters();
    }
  }, [hashId]);

  useEffect(() => {
    const getBottomChapters = async () => {
      try {
        const bottomChapterData = await fetchChapterListBottom(hashId);
        setBottomChapters(bottomChapterData);
      } catch (error) {
        console.error("Error fetching bottom chapters:", error);
      }
    };
    getBottomChapters();
  }, [hashId]);

  useEffect(() => {
    let timer;
    if (selectedChapterId) {
      const getChapterDetail = async () => {
        try {
          const chapterDetail = await fetchChapterDetail(selectedChapterId);
          chapterDetail.body = chapterDetail.body.replace(/\n/g, "  \n");
          setSelectedChapterDetail(chapterDetail);
          const url = new URL(window.location);
          url.searchParams.set("chapterHashId", selectedChapterId);
          window.history.replaceState({}, '', url);
        } catch (error) {
          console.error("Error fetching chapter detail:", error);
        }
      };
      getChapterDetail();

      timer = setTimeout(async () => {
        try {
          await fetchView(selectedChapterId); 
          console.log("Added 1 view");
        } catch (error) {
          console.error("Error adding view:", error);
        }
      }, 5000);
      setTimeoutId(timer);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [selectedChapterId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef1.current &&
        !dropdownRef1.current.contains(event.target)
      ) {
        setShowChapters1(false);
      }
      if (
        dropdownRef2.current &&
        !dropdownRef2.current.contains(event.target)
      ) {
        setShowChapters2(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChapterClick = (chapterId) => {
    setSelectedChapterId(chapterId);
    setShowChapters1(false);
    setShowChapters2(false);
    scrollToTop();
  };

  const handlePreviousChapter = () => {
    if (selectedChapterId) {
      const currentIndex = chapters.findIndex(
        (chapter) => chapter.hashId === selectedChapterId
      );
      if (currentIndex > 0) {
        setSelectedChapterId(chapters[currentIndex - 1].hashId);
        scrollToTop();
      }
    }
  };

  const handleNextChapter = () => {
    if (selectedChapterId) {
      const currentIndex = chapters.findIndex(
        (chapter) => chapter.hashId === selectedChapterId
      );
      if (currentIndex < chapters.length - 1) {
        setSelectedChapterId(chapters[currentIndex + 1].hashId);
        scrollToTop();
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    hashId,
    chapters,
    bottomChapters,
    selectedChapterId,
    selectedChapterDetail,
    showChapters1,
    showChapters2,
    dropdownRef1,
    dropdownRef2,
    setHashId,
    handleChapterClick,
    handlePreviousChapter,
    handleNextChapter,
    setShowChapters1,
    setShowChapters2,
  };
};

export default useReadingPage;
