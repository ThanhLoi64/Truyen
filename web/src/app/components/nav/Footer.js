import React from "react";
import Link from "next/link";
import Image from "next/image";
import DownloadAPKImage from '../../components/nav/DownloadAPK.png';
const Footer = () => {
  return (
    <footer className="bg-[#EEEDEB] pt-4 mt-10">
      <div className="container mx-auto justify-between items-center">
        <div className="flex text-gray-600 space-x-20 justify-center">
          <p className="transform transition-transform duration-200 hover:scale-105 cursor-pointer">
            TRANG CHỦ
          </p>
          <p className="transform transition-transform duration-200 hover:scale-105 cursor-pointer">
            VỀ CHÚNG TÔI
          </p>
          <p className="transform transition-transform duration-200 hover:scale-105 cursor-pointer">
            LIÊN HỆ
          </p>
          <p className="transform transition-transform duration-200 hover:scale-105 cursor-pointer">
            QUY ĐỊNH & ĐIỀU KHOẢN
          </p>
          <p className="transform transition-transform duration-200 hover:scale-105 cursor-pointer">
            HỎI ĐÁP
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4 pr-[12.5rem]">
          <div className="pr-32">
            <p className="text-gray-600 mb-2">LIÊN HỆ HỖ TRỢ</p>
            <form className="max-w-md mx-auto">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full italic p-2 pr-28 text-sm text-gray-900 border border-gray-300 rounded-[1.75rem] bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Nhập Email"
                  required
                />
                <button
                  type="submit"
                  className="text-white absolute end-2 bottom-[4.75px] bg-[#3C3633] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[1.75rem] text-sm px-4 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  XÁC NHẬN
                </button>
              </div>
            </form>
          </div>

          <div className=" h-20 border-r border-gray-700 rounded-xl"></div>
          <div className="flex space-x-7 mt-7 pl-32">
          
            <Link
              href="https://app-beta.bs.io.vn/apk/BSON_NOVEL%20v0.0.4.apk"
              className="transform transition-transform duration-200 hover:scale-105 cursor-pointer"
            >
               <Image
                src={DownloadAPKImage}
                alt="Download APK"
                width={150} 
                height={32} 
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-[#747264]">
        <p className="text-center text-white mt-4 py-2 mr-10">truyen.bs.io.vn</p>
      </div>
    </footer>
  );
};

export default Footer;
