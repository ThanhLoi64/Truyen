"use client";
import React, { useEffect, useState } from "react";
import NewChaprter from "../NewChapter/page";
import { SeriesDetailBook } from "@/app/api/user";
import { CiHeart } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SeriesDetail = () => {
  const [data, setData] = useState(null);
  const [hashId, setHashId] = useState(null);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const query = new URLSearchParams(window.location.search);
      const hashIdFromQuery = query.get("hashId");
      setHashId(hashIdFromQuery);

      const fetchData = async (hashId) => {
        try {
          const response = await SeriesDetailBook(hashId);
          setData(response);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      if (hashIdFromQuery) {
        fetchData(hashIdFromQuery);
      }
    }
  }, [hashId]);

  if (!data) {
    return (
      <div className="flex flex-wrap justify-center gap-4 w-full">
        <div className="flex flex-row gap-8">
          <div>
            <Skeleton width={250} height={380} />
            <div className="my-4 text-lg">
              <Skeleton width={100} height={20} />
              <Skeleton width={100} height={20} />
              <Skeleton width={100} height={20} />
            </div>
          </div>
          <div>
            <div className="">
              <Skeleton width={400} height={40} />
              <div className="flex gap-4 justify-center">
                <Skeleton width={60} height={20} />
                <Skeleton width={60} height={20} />
              </div>
              <div className="max-w-2xl min-h-64 min-w-[42rem]">
                <Skeleton count={5} />
              </div>
            </div>
            <NewChaprter />
          </div>
        </div>
      </div>
    );
  }

  const summaryContent =
    isSummaryExpanded || data.summary.length <= 700
      ? data.summary
      : `${data.summary.slice(0, 700)}...`;

  return (
    <div className="flex flex-wrap justify-center gap-4 w-full">
      <div className="flex flex-row gap-8">
        <div>
          <div>
            <img
              src={data.thumbnailImg.url}
              alt="img"
              className="w-[250px] h-[380px] object-cover rounded shadow-floating cursor-pointer border-2"
            />
          </div>
          <div className="my-4 text-lg">
            <div className="flex font-bold">
              Tác giả: <h3 className="mx-2 font-normal">{data.author}</h3>
            </div>
            <div className="flex font-bold">
              Thể Loại:<h3 className="mx-2 font-normal">{data.categoryName}</h3>
            </div>
            <div className="flex font-bold">
              Trạng thái:
              <h3
                className={`mx-2 font-normal ${data.isCompleted === true ? "text-green-500" : "text-yellow-500"}`}
              >
                {data.isCompleted === true ? "Hoàn thành" : "Đang ra"}
              </h3>
            </div>
          </div>
        </div>
        <div>
          <div className="">
            <h1 className="text-3xl text-center font-semi mb-4">
              {data.title}
              <hr className="font"></hr>
              <div className="flex gap-4 justify-center">
                <span className="flex items-center text-sm justify-center font-semibold">
                  <CiHeart className="mx-1 text-base" />
                  {data.voteCount}
                </span>
                <span className="flex items-center text-sm justify-center font-semibold">
                  <IoEyeOutline className="mx-1 text-base justify-center" />
                  {data.view}
                </span>
              </div>
            </h1>

            <div className="max-w-xl min-h-64 min-w-[35rem]">
              {summaryContent}
              {data.summary.length > 700 && (
                <button
                  className={`ml-2 ${isSummaryExpanded ? "text-black" : "text-black"}`}
                  onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                >
                  {isSummaryExpanded ? (
                    <span className="flex text-xs px-1 items-center pb-[1px] bg-gray-200 rounded-[3px] border border-gray-300">
                      <MdKeyboardDoubleArrowLeft />
                      Thu gọn
                    </span>
                  ) : (
                    <span className="flex text-xs px-1 items-center pb-[1px] bg-gray-200 rounded-[3px] border border-gray-300">
                      Xem thêm
                      <MdKeyboardDoubleArrowRight />
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
          <NewChaprter />
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;
