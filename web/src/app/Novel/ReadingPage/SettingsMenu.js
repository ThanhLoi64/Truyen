import React, { useRef, useEffect } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { MdWbSunny } from "react-icons/md";
import { FaMinus, FaPlus } from "react-icons/fa";

const SettingsMenu = ({
  fontSize,
  setFontSize,
  isDarkMode,
  setIsDarkMode,
  fontFamily,
  setFontFamily,
  isDropdownOpen,
  toggleDropdown,
}) => {
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      toggleDropdown();
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div
      className="fixed top-1/2 left-20 transform -translate-y-1/2 p-2 z-50"
      style={{ width: "max-content" }}
    >
      <button className="p-2 rounded bg-[#7B7B7B] " onClick={toggleDropdown}>
        <IoSettingsOutline style={{ fontSize: "30px", color: "white" }} />
      </button>
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className={`gap-2 absolute bg-[#7B7B7B] rounded shadow-lg left-full -top-11  ml-2 px-4 text-white`}
        >
          <li className="flex items-center gap-1">
            <div className="flex-shrink-0">Cỡ chữ:</div>
            <button
              className={`ml-1 py-1 w-16 rounded my-2 font-bold text-xl ${fontSize <= 15 ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => {
                if (fontSize > 15) {
                  setFontSize(fontSize - 2);
                }
              }}
              disabled={fontSize <= 15}
            >
              A-
            </button>
            <span className="py-1 w-16 text-center text-base font-mono">
              {fontSize}px
            </span>
            <button
              className={`py-1 w-16 rounded font-bold text-xl ${fontSize >= 45 ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => {
                if (fontSize < 45) {
                  setFontSize(fontSize + 2);
                }
              }}
              disabled={fontSize >= 45}
            >
              A+
            </button>
          </li>

          <li className="flex items-center gap-1 pb-4">
            <div className="flex-shrink-0">Màu nền:</div>
            <button
              className={`py-2 w-20 rounded flex items-center justify-center ${!isDarkMode ? "bg-gray-300 text-black" : "bg-gray-600 text-white"}`}
              onClick={() => setIsDarkMode(false)}
            >
              <MdWbSunny />
            </button>
            <button
              className={`py-2 w-20 rounded flex items-center justify-center ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-400 text-black"}`}
              onClick={() => setIsDarkMode(true)}
            >
              <BsFillMoonStarsFill />
            </button>
          </li>
          <li className="flex items-center gap-1 pb-4">
            <div className="flex-shrink-0">Kiểu chữ:</div>
            <select
              className="py-1 w-[164px] rounded bg-gray-300 text-black"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            >
              <option value="'Palatino Linotype', serif">
                Palatino Linotype
              </option>
              <option value="'Arial', sans-serif">Arial</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="'Noto Sans', sans-serif">Noto Sans</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="'Verdana', sans-serif">Verdana</option>
            </select>
          </li>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
