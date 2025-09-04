"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchTopSeries } from "@/app/api/user";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CiHeart } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";

const truncateTitle = (title, length) => {
  if (title.length <= length) {
    return title;
  }
  return title.slice(0, length) + "...";
};

const SeriesItem = ({ title, genres, vote, view, imgSrc, href, loading, rank }) => {
  let rankImg;

  switch (rank) {
    case 'Top 1':
      rankImg = '/images/top1.png'; 
      break;
    case 'Top 2':
      rankImg = '/images/top2.png'; 
      break;
    case 'Top 3':
      rankImg = '/images/top3.png';
      break;
    default:
      rankImg = ''; 
  }

  return (
    <div className="flex items-start my-2 cursor-pointer">
      {loading ? (
        <Skeleton
          width={250}
          height={144}
          className="h-36 rounded-2xl border-gray-300 shadow-lg"
        />
      ) : (
        <img
          src={imgSrc}
          alt={title}
          width="100"
          className="h-[155px] rounded-[0.5rem] border-gray-300 shadow-lg object-cover"
        />
      )}
      <div className="mx-2 my-2">
        <h4
          className="font-bold text-xl flex items-center"
          title={title}
        >
          {loading ? <Skeleton width={200} /> : truncateTitle(title, 25)}
          {loading ? null : (
            rankImg && (
              <img
                src={rankImg}
                width={24}
                className="ml-2"
              />
            )
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
              <span className="flex items-center text-sm">
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
              <span className="flex items-center text-sm">
                <IoEyeOutline className="mx-1 text-base" /> {view}
              </span>
            </>
          )}
        </h1>

        {loading ? (
          <Skeleton width={80} height={30} />
        ) : (
          <Link
            href={href}
            className="flex justify-center rounded-xl w-24 h-8 text-sm items-center mt-2 py-1 text-white bg-[#E2C696] sm:mb-0 hover:bg-[#FFD971] transform transition-transform duration-200 hover:scale-105"
          >
            Đọc
          </Link>
        )}
      </div>
    </div>
  );
};




const TopSeriesPage = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTopSeries();
      const sortedData = data.sort((a, b) => b.voteCount - a.voteCount);
      setSeriesData(sortedData.slice(0, 3));
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="ml-5">
      <Link
        href={`/MainPage/TopSeries/TopSeriesPage`}
        className="items-center flex text-2xl font-semi mb-4 underline decoration-[1px] underline-offset-2 cursor-pointer transform transition-transform duration-200 hover:scale-105"
      >
        TOP BÌNH CHỌN
        <IoIosArrowForward />
      </Link>
      <div className=" pl-2 rounded-xl">
        {loading
          ? Array(3)
              .fill()
              .map((_, index) => <SeriesItem key={index} loading={loading} />)
          : seriesData.map((series, index) => (
              <SeriesItem
                key={series.hashId}
                title={series.title}
                genres={series.categoryName}
                vote={series.voteCount}
                view={series.view}
                imgSrc={series.coverImg.url}
                href={`/Novel/SingleSeriesPage?hashId=${series.hashId}`}
                loading={loading}
                rank={`Top ${index + 1}`}
              />
            ))}
      </div>
    </div>
  );
};



export default TopSeriesPage;