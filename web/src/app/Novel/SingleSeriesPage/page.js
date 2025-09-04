import Header from "@/app/MainPage/Header/Header";
import Footer from "@/app/components/nav/Footer";
import SeriesDetail from "./SeriesDetail/page";
import HotSeries from "./HotSeries/page";
import ChapterList from "./ChapterList/page";
import CommentSection from "./components/CommentSection";

const SingleSeriesPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow pt-5 flex flex-col items-center w-full">
        <div className="flex flex-wrap justify-center gap-4 w-full">
          <div>
            <h1 className="text-2xl font-semi mb-6 underline decoration-[1px] underline-offset-2">
              THÔNG TIN TRUYỆN
            </h1>
            <SeriesDetail />
          </div>
          <HotSeries />
        </div>

        <div className="w-full max-w-[84rem] px-4 mt-5">
          <h1 className="text-2xl font-semi underline decoration-[1px] underline-offset-2 mb-4">
            DANH SÁCH CHƯƠNG
          </h1>
          <ChapterList />

          <CommentSection />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SingleSeriesPage;
