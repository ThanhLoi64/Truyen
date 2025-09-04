"use client";
import { GetEditChapter, EditChapter } from '@/app/api/user';
import React, { useState, useEffect, useRef } from 'react';
import FormEditChapter from '@/app/components/formEditChapter/formEditChapter';
import { EMPTY_FIELD_ERROR } from '../../../../../../errorConstants'

const EditChapterPage = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [postId, setPostId] = useState('');
  const [postItemId, setPostItemId] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [body, setBody] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const publishDateRef = useRef(null);
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postItemIdFromURL = params.get("postItemId");
    if (postItemIdFromURL) {
      setPostItemId(postItemIdFromURL);
      fetchChapterDetails(postItemIdFromURL);
    }
  }, []);

  useEffect(() => {
    const generateNameFromTitle = (title) => {
      if (!title) return '';
      const nameWithoutSpecialChars = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+/g, '')
        .replace(/-+$/g, '');
      return nameWithoutSpecialChars;
    };

    setName(generateNameFromTitle(title));
  }, [title]);

  const fetchChapterDetails = async (postItemId) => {
    try {
      const chapterData = await GetEditChapter(postItemId);
      setName(chapterData.name);
      setTitle(chapterData.title);
      setPublishDate(formatDateForInput(chapterData.publishDate));
      setBody(chapterData.body);
      setIsPublic(chapterData.isPublic);
      setIsPublished(chapterData.isPublished);
    } catch (error) {
      setError('Lỗi tải dữ liệu chương. Vui lòng thử lại sau.');
      console.error('Error fetching chapter details:', error);
    }
  };

  const formatDateForAPI = (date) => {
    if (!date) return '';
    const isoDate = new Date(date).toISOString();
    return isoDate;
  };

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const validateName = (name) => {
    const nameRegex = /^[a-z0-9\-]+$/;
    return nameRegex.test(name);
  };


  const handleSubmit = async (e, saveDraft, savePublic) => {
    e.preventDefault();

    if (!title || !body) {
      setSnackbarSeverity("error");
      setSnackbarMessage(EMPTY_FIELD_ERROR);
      setOpenSnackbar(true);
      return;
    }

    if (!validateName(name)) {
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setSnackbarMessage("Tên chương không hợp lệ. Chỉ chấp nhận chữ cái viết thường, số và dấu gạch ngang.");
      return;
    }

    let formattedPublishDate = null;
    if (savePublic && publishDate || saveDraft && publishDate) {
      formattedPublishDate = formatDateForAPI(publishDate);
    }

    const chapterData = {
      name,
      title,
      postItemId,
      publishDate: formattedPublishDate,
      body,
      isDraft: saveDraft,
      isPublic: savePublic,
    };
    if (!saveDraft && savePublic && !publishDate) {
      chapterData.publishDate = formatDateForAPI(new Date());
    }
    try {
      await EditChapter(postItemId, chapterData);
      setError('');
      setSnackbarMessage("Chỉnh sửa chương thành công!");
      setOpenSnackbar(true);
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage('Lỗi sửa chương mới. Vui lòng thử lại sau.');
      setOpenSnackbar(true);
      console.error('Error editing chapter:', error.response ? error.response.data : error.message);
    }
  };

  const handleSaveDraft = (e) => {
    handleSubmit(e, true, false);
  };

  const handlePublish = (e) => {
    handleSubmit(e, false, true);
  };
  const handlePublicChange = (e) => {
    setIsPublic(e.target.checked);
    if (e.target.checked) {
      setTimeout(() => {
        if (publishDateRef.current) {
          publishDateRef.current.focus();
          publishDateRef.current.showPicker();
        }
      }, 100);
    }
  };

  return (
    <FormEditChapter
      handleSubmit={handleSubmit}
      title={title}
      setTitle={setTitle}
      name={name}
      setName={setName}
      publishDate={publishDate}
      setPublishDate={setPublishDate}
      isPublic={isPublic}
      handlePublicChange={handlePublicChange}
      body={body}
      setBody={setBody}
      handleSaveDraft={handleSaveDraft}
      handlePublish={handlePublish}
      openSnackbar={openSnackbar}
      handleCloseSnackbar={handleCloseSnackbar}
      snackbarMessage={snackbarMessage}
      snackbarSeverity={snackbarSeverity}
      publishDateRef={publishDateRef}
    />
  );
};

export default EditChapterPage;
