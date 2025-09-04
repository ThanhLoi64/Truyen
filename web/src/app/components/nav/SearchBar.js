import React, { useState, useEffect, useRef } from "react";
import { searchAllPages } from "@/app/api/user";
import { useRouter } from "next/navigation";
import { Snackbar, Alert } from "@mui/material";

const SearchBar = ({ onResultsUpdate = () => {}, initialPage = 1 }) => {
  const [searchInput, setSearchInput] = useState("");
  const [titles, setTitles] = useState([]);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const savedSearchInput = localStorage.getItem("searchKeyword");
    const savedTitles = localStorage.getItem("searchResults");

    if (savedSearchInput) {
      setSearchInput(savedSearchInput);
    }
    if (savedTitles) {
      setTitles(JSON.parse(savedTitles));
      onResultsUpdate(JSON.parse(savedTitles));
    }
  }, []);

  const handleSearch = async (input) => {
    const trimmedInput = input.trim().replace(/\s+/g, " ");
    if (trimmedInput.length === 0) {
      setTitles([]);
      return;
    }
    try {
      const data = await searchAllPages(trimmedInput);
      console.log("API Response:", data);
      if (data && data.length > 0) {
        setTitles(data);
        onResultsUpdate(data);
        setOpenSnackbar(false);
        localStorage.setItem("searchKeyword", trimmedInput);
        localStorage.setItem("searchResults", JSON.stringify(data));
      } else {
        setTitles([]);
        onResultsUpdate([]);
        setOpenSnackbar(true);
        setSnackbarSeverity("info");
        setSnackbarMessage("Không tìm thấy truyện");
        localStorage.setItem("searchKeyword", trimmedInput);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setTitles([]);
      onResultsUpdate([]);
      setOpenSnackbar(true);
      setSnackbarSeverity("error");
      setSnackbarMessage("Lỗi khi tìm kiếm");
    }
  };

  const handleEnterKey = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      await performSearch();
    }
  };

  const performSearch = async () => {
    if (searchInput.trim().length <= 2) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Tên truyện phải trên 2 ký tự");
      setOpenSnackbar(true);
    } else {
      await handleSearch(searchInput);
      if (titles.length === 0) {
        // Xử lý thông báo không có kết quả nếu cần
      } else {
        router.push(
          `/SearchResults?Keyword=${encodeURIComponent(searchInput)}&Page=1`
        );
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    performSearch();
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Tìm kiếm
        </label>
        <div className="relative">
          <div
            className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
            onClick={performSearch} // Thêm sự kiện click vào icon tìm kiếm
          >
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="!outline-none block w-full mt-1 p-2 ps-10 mr-36 text-sm text-gray-900 border rounded-[10px] bg-[#ffffff62] focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Tìm kiếm truyện...."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleEnterKey}
          />
        </div>
        <button type="submit" className="hidden">
          Search
        </button>
      </form>
      <div className="">
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          className="fixed top-[2rem] left-4 z-[1300]"
        >
          <Alert
            variant="filled"
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default SearchBar;
