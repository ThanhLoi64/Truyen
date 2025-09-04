'use client'
import Footer from "./components/nav/Footer";
import MainPage from "./MainPage/page";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainPage className="flex" />
      <Footer/>
    </div>
  );
}
