"use client";
import React, { useEffect, useState } from "react";
import { fetchTopView } from "@/app/api/user";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CiHeart } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";

const truncateTitle = (title, length) => {
  if (title.length <= length) {
    return title;
  }
  return title.slice(0, length) + "...";
};

const SeriesItem = ({ title, genres, vote, view, imgSrc, href, loading }) => (
  <div className="flex items-center my-3 cursor-pointer justify-start">
    {loading ? (
      <Skeleton
        width={100}
        height={144}
        className="h-36 rounded-2xl border-gray-300 shadow-lg"
      />
    ) : (
      <img
        src={imgSrc}
        alt={title}
        width="100"
        className="h-36 rounded-[0.5rem] border-gray-300 shadow-2xl object-cover"
      />
    )}
    <div className="mx-2 my-2">
      <h4 className="flex font-bold text-lg items-center" title={title}>
        {loading ? <Skeleton width={200} /> : truncateTitle(title, 25)}

        {loading ? (
          <Skeleton width={10} />
        ) : (
          <>
            <p className="text-xs mx-1 border border-[#FD8383] text-[#FD8383] bg-transparent pt-[1px] px-1">
              HOT
            </p>
          </>
        )}
      </h4>
      <h1 className="text-sm italic">
        {loading ? <Skeleton width={150} /> : genres}
      </h1>
      <h1 className="text-sm">
        {loading ? (
          <Skeleton width={100} />
        ) : (
          <>
            <span className="flex items-center text-sm font-semibold">
              <CiHeart className="mx-1 text-base" /> {vote}
            </span>
          </>
        )}
      </h1>
      <h1 className="text-xs">
        {loading ? (
          <Skeleton width={100} />
        ) : (
          <>
            <span className="flex items-center text-sm font-semibold">
              <IoEyeOutline className="mx-1 text-base" /> {view}
            </span>
          </>
        )}
      </h1>
      {loading ? (
        <Skeleton width={80} height={30} />
      ) : (
        <button
          onClick={() => (window.location.href = href)}
          className="flex justify-center rounded-xl w-24 h-8 text-sm items-center mt-2 py-1 text-white bg-[#E2C696] sm:mb-0 hover:bg-[#FFD971] transform transition-transform duration-200 hover:scale-105"
        >
          Đọc
        </button>
      )}
    </div>
  </div>
);

const HotSeries = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTopView();
      const sortedData = data.sort((a, b) => b.viewCount - a.viewCount);
      setSeriesData(sortedData.slice(0, 3));
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="ml-5 bg-[#f0efe9] rounded px-3 py-1">
      <Link
        href={`/Novel/SingleSeriesPage/HotSeries/SingleHotSeriesPage`}
        className="items-center flex text-2xl mb-4 mt-1 font-semi underline decoration-[1px] underline-offset-2 cursor-pointer transform transition-transform duration-200 hover:scale-105  "
      >
        GỢI Ý CHO BẠN
        <IoIosArrowForward />
      </Link>
      <div className="">
        {loading
          ? Array(3)
              .fill()
              .map((_, index) => <SeriesItem key={index} loading={loading} />)
          : seriesData.map((series) => (
              <SeriesItem
                key={series.id}
                title={series.title}
                genres={series.categoryName}
                view={series.view}
                vote={series.voteCount}
                hashId={series.hashId}
                imgSrc={series.coverImg.url}
                href={`../Novel/SingleSeriesPage?hashId=${series.hashId}`}
                loading={loading}
              />
            ))}
      </div>
    </div>
  );
};

export default HotSeries;
