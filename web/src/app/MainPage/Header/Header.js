'use client'
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { FaBook, FaListUl, FaTags } from "react-icons/fa";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { fetchUserCategoryList } from "@/app/api/user";

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null); // <-- thêm dòng này
  const [activeLink, setActiveLink] = useState(null);
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);

  const danhSachLeft = [
    "Truyện dưới 100 chương",
    "Truyện 100-500 chương",
    "Truyện trên 1000 chương",
  ];
  const danhSachRight = [
    "Truyện sắp ra mắt",
    "Truyện đã xuất bản",
  ];

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesList = await fetchUserCategoryList();
        categoriesList.sort((a, b) => a.name.length - b.name.length);
        setCategories(categoriesList);
      } catch (error) {
        console.error(error);
      }
    };
    loadCategories();
  }, []);

  const handleLinkClickCategory = (categoryId) => {
    window.location.href = `/MainPage/CategorySeries?CategoryId=${categoryId}`;
  };

  return (
    <nav className="bg-[#EEEDEB] border-gray-200 dark:bg-gray-900 dark:border-gray-700 shadow-xl sticky z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-4 relative z-50">
        <div className="hidden w-full md:block md:w-auto relative" id="navbar-dropdown">
          <ul className="flex flex-col font-medium text-lg gap-10 p-4 md:p-0 mt-4 border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">

            <li
              className="relative flex items-center rounded px-2 py-1"
              onMouseEnter={() => setActiveDropdown('danh-sach')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <FaListUl />
              <button
                className="block py-2 px-3 mx-2 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[--button] md:p-0 dark:text-white"
                onClick={() => handleLinkClick('danh-sach')}
              >
                Danh sách
              </button>
              {activeDropdown === 'danh-sach' && (
                <div className="absolute top-8 left-0 w-[592px] h-[181px] bg-[#e7dcd4] rounded shadow-lg z-50 p-4 grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    {danhSachLeft.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => setActiveLink(item)}
                        className={`px-3 py-2 rounded cursor-pointer ${activeLink === item ? 'bg-[#d8d8d8]' : ''}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-2">
                    {danhSachRight.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => setActiveLink(item)}
                        className={`px-3 py-2 rounded cursor-pointer ${activeLink === item ? 'bg-[#d8d8d8]' : ''}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>

            <li
              className="relative flex items-center rounded px-2 py-1"
              onMouseEnter={() => setActiveDropdown('the-loai')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <FaTags />
              <Link
                href="#"
                className="block py-2 px-3 mx-2 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[--button] md:p-0 dark:text-white"
              >
                Thể loại
              </Link>
              {activeDropdown === 'the-loai' && (
                <ul className="absolute top-8 left-0 w-[30rem] bg-[#e7dcd4] rounded shadow-lg dark:bg-gray-800 z-50 flex flex-wrap p-4">
                  {categories.map((category) => (
                    <li key={category.id} className="w-full md:w-1/2">
                      <a
                        href="#"
                        onClick={() => handleLinkClickCategory(category.id)}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>


            <li className={`flex items-center rounded px-2 py-1 ${activeLink === 'truyen-full' ? 'bg-[#e7dcd4]' : ''}`}>
              <FaBook />
              <Link
                href="#"
                className="block py-2 px-3 mx-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[--button] md:p-0 dark:text-white"
                onClick={() => handleLinkClick('truyen-full')}
              >
                Truyện full
              </Link>
            </li>

            {/* TÙY CHỈNH */}
            <li className={`flex items-center rounded px-2 py-1 ${activeLink === 'tuy-chinh' ? 'bg-[#e7dcd4]' : ''}`}>
              <MdKeyboardDoubleArrowDown />
              <Link
                href="#"
                className="block py-2 px-3 mx-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[--button] md:p-0 dark:text-white"
                onClick={() => handleLinkClick('tuy-chinh')}
              >
                Tùy chỉnh
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
