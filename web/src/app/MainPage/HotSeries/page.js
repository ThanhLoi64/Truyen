"use client";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useEffect, useState } from "react";
import { fetchTopView } from "@/app/api/user";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import "react-loading-skeleton/dist/skeleton.css";

const HotSeriesPage = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTopView();
        setSeriesData(data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching top series:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="ml-6 relative z-10" style={{ maxWidth: "850px" }}>
      <style>
        {`
          .carousel.carousel-slider .control-arrow {
            background-color: transparent !important;
          }
          .carousel.carousel-slider {
            border-radius: 0.5rem;
            overflow: hidden;
          }
          .carousel-item {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.5rem;
          }
          .carousel-item img.main-img {
            border-radius: 0.5rem;
            object-fit: cover;
          }
          .carousel-item img.small-img {
            position: absolute;
            top: 2.5rem;
            left: 5rem;
            width: 250px;
            height: 400px;
            border-radius: 0.5rem;
            object-fit: cover;
            border-width: 2px; 
            border-style: solid; 
            border-color: #f7fafc; 
            box-shadow: 0 4px 6px rgba(156, 163, 175, 1);
            box-shadow: 0 0 10px rgba(156, 163, 175, 0.4);
          }
          .info-overlay {
            border-radius: 1rem;
          }
          .carousel .carousel-status {
            display: none;
          }
        `}
      </style>
      <h1 className="text-2xl font-semi mb-4">TRUYỆN HOT</h1>
      <div style={{ maxWidth: "900px" }}>
        {loading ? (
          <Carousel
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            stopOnHover={true}
            className="carousel-wrapper cursor-pointer"
          >
            {Array(5)
              .fill()
              .map((_, index) => (
                <div key={index} className="carousel-item">
                  <Skeleton
                    height={400}
                    width={900}
                    className="rounded-2xl border-gray-300"
                    style={{ maxWidth: "900px" }}
                  />
                  <div className="info-overlay">
                    <Skeleton width={900} />
                    <Skeleton width={900} />
                  </div>
                </div>
              ))}
          </Carousel>
        ) : (
          <Carousel
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            stopOnHover={true}
            className="carousel-wrapper cursor-pointer"
          >
            {seriesData.map((series) => (
              <div key={series.id} className="carousel-item">
                <img
                  src={series.coverImg.url}
                  alt={series.title}
                  className="main-img rounded-[0.5rem] border-gray-300 shadow-lg cursor-pointer relative"
                  style={{
                    maxWidth: "900px",
                    maxHeight: "480px",
                    borderRadius: "1rem",
                    background: "rgba(0, 0, 0, 0.3)",
                    filter: "blur(15px)",
                  }}
                />
                <img
                  src={series.coverImg.url}
                  alt={`${series.title} small`}
                  className="small-img"
                />
                <div className="absolute top-0 left-0 w-full h-full rounded-xl bg-gradient-to-b from-transparent to-black opacity-50"></div>
                <div className="absolute items-center justify-center text-left text-white z-10 left-96">
                  <p className="text-3xl font-semibold py-4">{series.title}</p>
                  <p className="text-sm py-1">Tác giả: {series.author}</p>
                  <p className="text-sm py-1">
                    Danh mục: {series.categoryName}
                  </p>
                  <div className="flex gap-2">
                    <p className="text-sm flex items-center gap-1">
                      <h1 className="text-lg items-end font-semibold">
                        {series.view}
                      </h1>{" "}
                      lượt xem
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <h1 className="text-lg item-start font-semibold">
                        {series.voteCount}
                      </h1>{" "}
                      lượt vote
                    </p>
                  </div>
                </div>
                <Link
                  href={`/Novel/SingleSeriesPage?hashId=${series.hashId}`}
                  className="absolute bottom-4 right-4 px-16 py-2 bg-[--button] text-white font-bold rounded-xl shadow-md hover:bg-[--buttonSoft] hover:text-white transform transition-transform duration-200 hover:scale-105"
                >
                  ĐỌC
                </Link>
              </div>
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default HotSeriesPage;