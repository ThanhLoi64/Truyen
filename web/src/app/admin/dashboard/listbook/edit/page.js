"use client";
import React, { useState, useEffect } from "react";
import {
  editSeriesAdmin,
  fetchUserCategoryList,
  uploadFile,
  getPostIdAdmin,
} from "@/app/api/user";
import FormEditSeries from "@/app/components/formEditSeries/formEditSeries";
import ChapterPage from "../../chapter/page";
const EditPostPage = () => {
  const [postId, setPostId] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStatus, setIsStatus] = useState(false);
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [thumbnailId, setThumbnailId] = useState("");
  const [coverId, setCoverId] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isTitleManuallyChanged, setIsTitleManuallyChanged] = useState(false);
  const [isSingleFileUpload, setIsSingleFileUpload] = useState(false);
  const [useCoverAsThumbnail, setUseCoverAsThumbnail] = useState(false);
  const generateName = (title) => {
    if (!title) return "";
    const nameWithoutSpecialChars = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/^-+/g, "")
      .replace(/-+$/g, "");
    return nameWithoutSpecialChars;
  };

  useEffect(() => {
    if (!isTitleManuallyChanged) {
      setName(generateName(title));
    }
  }, [title]);
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const postIdFromQuery = searchParams.get("postId");
    if (postIdFromQuery) {
      setPostId(postIdFromQuery);
      fetchPostData(postIdFromQuery);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchUserCategoryList();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchPostData = async (postId) => {
    try {
      const postData = await getPostIdAdmin(postId);
      if (postData) {
        setName(postData.name);
        setTitle(postData.title);
        setAuthor(postData.author);
        setSummary(postData.summary);
        setIsPublic(postData.status === 1);
        setIsStatus(postData.status);
        setIsCompleted(postData.isCompleted);
        setCategoryId(postData.categoryId);
        setThumbnailId(postData.thumbnailImg.id);
        setCoverId(postData.coverImg.id);
        setThumbnailPreview(postData.thumbnailImg.url);
        setCoverPreview(postData.coverImg.url);
        setError("");
        setSuccessMessage("");
      } else {
        console.error("Không tìm thấy dữ liệu bài viết:", postId);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu bài viết:", error);
      setError("Failed to fetch post information.");
    }
  };
  const isTitleCapitalized = (title) => {
    return (
      title.length > 0 && title.charAt(0) === title.charAt(0).toUpperCase()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trimStart();

    if (
      !name ||
      !title ||
      !author ||
      !summary ||
      !categoryId ||
      (!useCoverAsThumbnail && !thumbnailId) ||
      !coverId
    ) {
      setSuccessMessage("");
      setError("Tất cả các trường đều phải được điền.");
      return;
    }
    if (trimmedTitle.length > 25) {
      setSuccessMessage("");
      setError("Tiêu đề không được vượt quá 25 ký tự.");
      return;
    }

    if (!isTitleCapitalized(trimmedTitle)) {
      setSuccessMessage("");
      setError("Tiêu đề phải bắt đầu bằng chữ cái in hoa cho mỗi từ.");
      return;
    }

    const finalThumbnailId = useCoverAsThumbnail ? coverId : thumbnailId;

    const postData = {
      id: postId,
      name,
      title: trimmedTitle,
      author,
      summary,
      isPublic,
      isCompleted,
      categoryId,
      thumbnailId: finalThumbnailId,
      coverId,
    };

    try {
      await editSeriesAdmin(postData, postId);
      setSuccessMessage("Cập nhật Truyện thành công!");
      setError("");
    } catch (error) {
      setError("Lỗi cập nhật Truyện. Vui lòng thử lại sau.");
      console.error(
        "Error details:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleFileUpload = async (file, setFileId, setPreview, isThumbnail) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadFile(formData);
      setFileId(response.id);
      setPreview(URL.createObjectURL(file));

      if (isSingleFileUpload && isThumbnail) {
        setCoverId(response.id);
        setCoverPreview(URL.createObjectURL(file));
      } else if (isSingleFileUpload && !isThumbnail) {
        setThumbnailId(response.id);
        setThumbnailPreview(URL.createObjectURL(file));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await handleFileUpload(file, setThumbnailId, setThumbnailPreview, true);
      } catch (error) {
        console.error("Error uploading thumbnail:", error);
        setThumbnailId("");
        setThumbnailPreview(null);
      }
    } else {
      setThumbnailId("");
      setThumbnailPreview(null);
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await handleFileUpload(file, setCoverId, setCoverPreview);
        if (useCoverAsThumbnail) {
          await handleFileUpload(
            file,
            setThumbnailId,
            setThumbnailPreview,
            true
          );
        }
      } catch (error) {
        console.error("Error uploading cover:", error);
        setCoverId("");
        setCoverPreview(null);
        if (useCoverAsThumbnail) {
          setThumbnailId("");
          setThumbnailPreview(null);
        }
      }
    } else {
      setCoverId("");
      setCoverPreview(null);
      if (useCoverAsThumbnail) {
        setThumbnailId("");
        setThumbnailPreview(null);
      }
    }
  };

  return (
    <div>
      <FormEditSeries
        title={title}
        setTitle={setTitle}
        name={name}
        setName={setName}
        author={author}
        setAuthor={setAuthor}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        categories={categories}
        summary={summary}
        setSummary={setSummary}
        isCompleted={isCompleted}
        setIsCompleted={setIsCompleted}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
        useCoverAsThumbnail={useCoverAsThumbnail}
        setUseCoverAsThumbnail={setUseCoverAsThumbnail}
        coverPreview={coverPreview}
        thumbnailPreview={thumbnailPreview}
        handleCoverChange={handleCoverChange}
        handleThumbnailChange={handleThumbnailChange}
        handleSubmit={handleSubmit}
        error={error}
        successMessage={successMessage}
      />
      <div>
        <ChapterPage />
      </div>
    </div>
  );
};

export default EditPostPage;
