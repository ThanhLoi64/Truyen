'use client';
import React, { useState, useRef, useEffect } from 'react';
import FormAddChapter from '@/app/components/formAddChapter/formAddChapter';
import { addChapterToSeries } from '@/app/api/user';
import { EMPTY_FIELD_ERROR } from '../../../../../../errorConstants'
const AddChapterPage = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [postId, setPostId] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const publishDateRef = useRef(null);
  const isMounted = useRef(false);
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    isMounted.current = true;

    const params = new URLSearchParams(window.location.search);
    const postIdParam = params.get('postId');
    if (postIdParam) {
      setPostId(postIdParam);
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const generateName = (title) => {
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
    if (isMounted.current) {
      setName(generateName(title));
    }
  }, [title]);

  const formatDateForAPI = (date) => {
    if (!date) return '';
    const isoDate = new Date(date).toISOString().split('T')[0] + 'T00:00:00Z';
    return isoDate;
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
      postId,
      publishDate: formattedPublishDate,
      body,
      isDraft: saveDraft,
      isPublic: savePublic,
    };

    if (!saveDraft && savePublic && !publishDate) {
      chapterData.publishDate = formatDateForAPI(new Date());
    }

    try {
      await addChapterToSeries(chapterData);
      if (isMounted.current) {
        setSnackbarMessage("Thêm chương thành công!");
        setName('');
        setTitle('');
        setPublishDate('');
        setBody('');
        setIsPublic(false);
        setError('');
        setOpenSnackbar(true);
        setSnackbarSeverity("success");
      }
    } catch (error) {
      if (isMounted.current) {
        setSnackbarSeverity("error");
        setSnackbarMessage('Lỗi thêm chương mới. Vui lòng thử lại sau.');
        setOpenSnackbar(true);
        console.error('Error details:', error.response ? error.response.data : error.message);
      }
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
    <FormAddChapter
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

export default AddChapterPage;
