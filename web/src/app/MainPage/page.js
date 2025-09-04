"use client";
import React from "react";
import HotSeriesPage from "./HotSeries/page";
import TopSeriesPage from "./TopSeries/page";
import UpdateSeriesPage from "./UpdateSeries/page";
import Header from "./Header/Header";
const MainPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-grow pt-5 flex justify-start items-center w-full flex-col">
        <div className="flex flex-wrap justify-center gap-4 w-full mb-4">
          <div className="flex flex-wrap bg-[#F0EFE9] rounded-xl py-2">
            <div>

              <HotSeriesPage />
            </div>
            <div>
              <TopSeriesPage />
            </div>
          </div>
        </div>
        <div>
          <UpdateSeriesPage />
        </div>
      </div>
    </div>

  );
};

export default MainPage;
