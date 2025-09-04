"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchChapterListBottom } from "@/app/api/web";
import { IoMdBookmarks } from "react-icons/io";

const NewChaprter = () => {
  const [hashId, setHashId] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const query = new URLSearchParams(window.location.search);
      const hashIdFromQuery = query.get("hashId");
      setHashId(hashIdFromQuery);

      const fetchData = async (hashId) => {
        try {
          const chaptersData = await fetchChapterListBottom(hashId);

          const sortedChapters = chaptersData.sort((a, b) => b.index - a.index);
          const lastFourChapters = sortedChapters.slice(-4).reverse();
          setChapters(lastFourChapters);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching chapters:", error);
          setLoading(false);
        }
      };

      if (hashIdFromQuery) {
        fetchData(hashIdFromQuery);
      }
    }
  }, [hashId]);

  if (loading) {
    return <p></p>;
  }

  return (
    <div className="my-2">
      <h3 className="text-xl font-semi mb-4 underline decoration-[1px] underline-offset-2">
        CÁC CHƯƠNG MỚI NHẤT
      </h3>
      <div className="max-w-full">
        {chapters.map((chapter) => (
          <div key={chapter.hashId}>
            <Link
              href={`../Novel/ReadingPage?hashId=${hashId}&chapterHashId=${chapter.hashId}`}
              className="flex justify-start ps-2 gap-1 rounded h-8 text-sm items-center mt-2 py-1 transform transition-transform duration-200"
            >
              <IoMdBookmarks />
              {chapter.title}
              <p className="text-xs mx-1 border border-[#0ea2ff] text-[#0ea2ff] bg-transparent pt-[1px] px-0.5">
                NEW
              </p>
            </Link>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewChaprter;
