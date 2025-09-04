"use client";
import React, { useEffect, useState } from "react";
import { fetchCategoryList } from "@/app/api/user";
import Link from "next/link";
import TableComponent from "@/app/components/table/table";
import { updateCategoryStatus } from "@/app/api/user";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const DataGridDemo = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, [page, searchQuery, showDeleted]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      let allItems = [];
      let currentPage = 1;
      let totalPages = 1;

      while (currentPage <= totalPages) {
        const response = await fetchCategoryList(currentPage, showDeleted);
        if (response && Array.isArray(response.items)) {
          allItems = [...allItems, ...response.items];
          totalPages = response.totalPages;
          currentPage++;
        } else {
          console.error("Unexpected data format:", response);
          break;
        }
      }

      const transformedData = allItems.map((category, index) => ({
        id: category.id,
        stt: index + 1,
        name: category.name || "",
        title: category.title || "",
        isDeleted: category.isDelete,
        isActived: category.isActived,
        totalPost: category.totalPost || "0",
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching category data:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const allData = await fetchAllData();
    let filteredData = allData.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!showDeleted) {
      filteredData = filteredData.filter((category) => !category.isDeleted);
    }

    const pageSize = 10;
    const paginatedData = filteredData.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    setRows(paginatedData);
    setTotalPages(Math.ceil(filteredData.length / pageSize));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEdit = (user) => {
    console.log("Editing User: ", user);
    setEditingUser(user);
  };

  const handleToggleStatus = async (category) => {
    const confirmMessage = category.isActived
      ? "Bạn có chắc chắn muốn vô hiệu hóa danh mục này?"
      : "Bạn có chắc chắn muốn kích hoạt danh mục này?";

    if (confirm(confirmMessage)) {
      try {
        await updateCategoryStatus(category.id, !category.isActived);

        // Cập nhật trạng thái trong state ngay lập tức
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === category.id
              ? { ...row, isActived: !row.isActived }
              : row
          )
        );

        const successMsg = `Đã ${
          category.isActived ? "vô hiệu hóa" : "kích hoạt"
        } thành công.`;
        setSnackbarMessage(successMsg);
        setSnackbarOpen(true);

        setTimeout(() => {
          setSnackbarOpen(false);
        }, 3000);

        // Đồng bộ lại dữ liệu từ server
      } catch (error) {
        console.error("Error updating category status:", error);
        alert("Đã xảy ra lỗi khi cập nhật trạng thái danh mục.");
      }
    }
  };

  const renderActions = (row) => (
    <>
      <Link
        href={`/admin/dashboard/category/edit?id=${row.id}`}
        onClick={() => handleEdit(row)}
        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
      >
        Sửa
      </Link>
      <button
        onClick={() => handleToggleStatus(row)}
        className={`font-medium ${row.isActived ? 'text-red-600' : 'text-green-600'
          } dark:text-blue-500 hover:underline mr-4`}
      >
        {row.isActived ? 'Vô hiệu hóa' : 'Kích hoạt'}
      </button>
    </>
  );

  const columns = [
    { key: "stt", header: "STT", width: "10rem" },
    {
      key: "name",
      header: "Tên danh mục",
      width: "20rem",
      className: "truncate w-24",
    },
    {
      key: "title",
      header: "Mô tả",
      width: "25rem",
      className:
        "truncate w-24 overflow-hidden whitespace-nowrap text-ellipsis",
    },
    {
      key: "totalPost",
      header: "Tổng truyện",
      width: "25rem",
      className:
        "truncate w-24 overflow-hidden text-center whitespace-nowrap text-ellipsis",
    },
  ];

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="">
      <div className="flex pl-[16rem] justify-between items-center py-1">
        <form className="rounded">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm rounded font-medium text-gray-900 sr-only dark:text-white"
          >
            Tìm kiếm
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
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
              className="block w-60 p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-300 dark:border-gray-300 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm Tên danh mục"
            />
          </div>
        </form>
        <Link
          href="/admin/dashboard/category/add"
          className="hidden lg:inline-block lg:ml-auto lg:mr-3 my-2 px-6 py-2 bg-[var(--button)] hover:bg-[var(--buttonSoft)] text-sm text-gray-900 font-bold rounded transition duration-200 border border-gray-300 dark:border-gray-600"
        >
          <button>Thêm danh mục</button>
        </Link>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity="success"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <TableComponent
        columns={columns}
        rows={rows}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        handleEdit={handleEdit}
        renderActions={renderActions}
      />
    </div>
  );
};

export default DataGridDemo;
