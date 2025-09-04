"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AdminChapterList,
  getPostIdAdmin,
  AdminDeleteChapter,
  ChapterHideAdmin
} from "@/app/api/user";
import Swal from "sweetalert2";
import FormListChapter from "@/app/components/formListChapter/formListChapter";

const ChapterPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [postId, setPostId] = useState("");
  const [postData, setPostData] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const postIdFromQuery = searchParams.get("postId");
    const nameFromQuery = searchParams.get("name");

    if (postIdFromQuery) {
      setPostId(postIdFromQuery);
    }
    if (nameFromQuery) {
      setName(nameFromQuery);
    }
    if (postIdFromQuery) {
      fetchPostInfo(postIdFromQuery);
    }
  }, []);

  const fetchPostInfo = async (postId) => {
    try {
      const data = await getPostIdAdmin(postId);
      if (data) {
        setPostData({
          id: data.id,
          thumbnailImg: data.thumbnailImg ? data.thumbnailImg.url : "",
          title: data.title || "",

        });
        setError(null);
      } else {
        console.error("Không thể lấy thông tin bài đăng:", postId);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin bài đăng:", error);
      setError("Failed to fetch post information.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AdminChapterList(postId, page, showDeleted);
      console.log("API response:", response);

      if (response && Array.isArray(response.items)) {
        const transformedData = response.items.map((item) => ({
          id: item.id,
          name: item.name,
          title: item.title,
          body: item.body,
          createdDate: new Date(item.createdDate).toLocaleDateString("en-GB"),
          publishDate: new Date(item.publishDate).toLocaleDateString("en-GB"),
          isDelete: item.isDelete,
          status: item.status
        }));
        setRows(transformedData);
        setTotalPages(response.totalPages);
      } else {
        console.error("Unexpected data format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (postId) {
      fetchData();
    }
  }, [postId, page, showDeleted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postId.trim() === "") {
      setError("Post ID cannot be empty");
      return;
    }
    await fetchPostInfo(postId);
    await fetchData();
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = await Swal.fire({
        title: "Bạn có chắc chắn muốn xóa?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });

      if (confirmDelete.isConfirmed) {
        await AdminDeleteChapter(id);
        await fetchData();
        Swal.fire("Đã xóa!", "Chương đã được xóa thành công.", "success");
      }
    } catch (error) {
      console.error("Lỗi xóa Chương:", error);
      Swal.fire("Lỗi!", "Đã có lỗi xảy ra khi xóa chương.", "error");
    }
  };

  const handleCheckboxChange = (e) => {
    setShowDeleted(e.target.checked);
  };

  const handleHide = async (postItemId, currentStatus) => {
    try {
      const newStatus = currentStatus === 3 ? 2 : 3;
      await ChapterHideAdmin(postItemId, newStatus);
      fetchData(postId, page);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  return (
    <div className="pl-[16rem]">
      <div className="flex justify-between items-center py-1">
        <h1 className="text-xl font-bold relative">
          Tên Truyện: {postData && postData.title}
        </h1>

        <Link
          href={`/admin/dashboard/chapter/add?postId=${postId}`}
          className="mr-1 hidden lg:inline-block lg:ml-auto lg:mr-3 my-2 px-6 py-2 bg-[var(--button)] hover:bg-[var(--buttonSoft)] text-sm text-gray-900 font-bold rounded transition duration-200 border border-gray-300 dark:border-gray-600"
        >
          <button>Thêm Chương</button>
        </Link>
      </div>

      {rows.length > 0 && (
        <div className="flex items-center my-1">
          <input
            type="checkbox"
            id="showDeletedCheckbox"
            onChange={handleCheckboxChange}
            checked={showDeleted}
            className="mr-2"
          />
          <label htmlFor="showDeletedCheckbox" className="text-sm">
            Hiển thị các mục đã xóa
          </label>
        </div>
      )}

      <FormListChapter
        rows={rows}
        page={page}
        limit={limit}
        totalPages={totalPages}
        setPage={setPage}
        handleDelete={handleDelete}
        handleHide={handleHide}
        basePath="/admin"
      />
    </div>
  );
};

export default ChapterPage;
