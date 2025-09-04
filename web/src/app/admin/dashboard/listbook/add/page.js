'use client';
import React, { useState, useEffect } from 'react';
import { addAdminPost, getCategories, uploadFile } from '@/app/api/user';
import FormAddSeries from '@/app/components/formAddSeries/formAddSeries';

const AddPostPage = () => {
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [author, setAuthor] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [thumbnailId, setThumbnailId] = useState('');
    const [coverId, setCoverId] = useState('');
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [isTitleManuallyChanged, setIsTitleManuallyChanged] = useState(false);
    const [isSingleFileUpload, setIsSingleFileUpload] = useState(false);
    const [useCoverAsThumbnail, setUseCoverAsThumbnail] = useState(false);
    const [successTimer, setSuccessTimer] = useState(null);
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
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                const activeCategories = data.items.filter(category => category.isActived);
                setCategories(activeCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
    
        fetchCategories();
    }, []);

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
          !trimmedTitle ||
          !author ||
          !summary ||
          !categoryId ||
          !coverId ||
          (!useCoverAsThumbnail && !thumbnailId)
        ) {
          setSuccessMessage("");
          setError("Tất cả các trường đều phải được điền.");
          return;
        }
    
        if (trimmedTitle.length > 30) {
          setSuccessMessage("");
          setError("Tiêu đề không được vượt quá 30 ký tự.");
          return;
        }
    
        if (!isTitleCapitalized(trimmedTitle)) {
          setSuccessMessage("");
          setError("Tiêu đề phải bắt đầu bằng chữ cái in hoa cho mỗi từ.");
          return;
        }
    
        const finalThumbnailId = useCoverAsThumbnail ? coverId : thumbnailId;
    
        const postData = {
          name,
          title: trimmedTitle,
          author,
          summary,
          isPublic,
          categoryId,
          thumbnailId: finalThumbnailId,
          coverId,
        };
    
        try {
          await addAdminPost(postData);
          setName("");
          setTitle("");
          setAuthor("");
          setUseCoverAsThumbnail(false);
          setSummary("");
          setIsPublic(false);
          setCategoryId("");
          setThumbnailId("");
          setCoverId("");
          setThumbnailPreview(null);
          setCoverPreview(null);
          setUseCoverAsThumbnail(false);
          setError("");
          setSuccessMessage("Thêm Truyện thành công!");
        } catch (error) {
          setError("Lỗi thêm Truyện. Vui lòng thử lại sau.");
          setSuccessMessage("");
          console.error(
            "Error details:",
            error.response ? error.response.data : error.message
          );
        }
      };

    const handleFileUpload = async (file, setFileId, isThumbnail) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await uploadFile(formData);
            setFileId(response.id);

            if (isSingleFileUpload && isThumbnail) {
                setCoverId(response.id);
                setCoverPreview(URL.createObjectURL(file));
            } else if (isSingleFileUpload && !isThumbnail) {
                setThumbnailId(response.id);
                setThumbnailPreview(URL.createObjectURL(file));
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    const handleThumbnailChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailPreview(URL.createObjectURL(file));
            try {
                await handleFileUpload(file, setThumbnailId, true);
            } catch (error) {
                console.error('Error uploading thumbnail:', error);
                setThumbnailId('');
                setThumbnailPreview(null);
            }
        } else {
            setThumbnailId('');
            setThumbnailPreview(null);
        }
    };

    const handleCoverChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverPreview(URL.createObjectURL(file));
            try {
                await handleFileUpload(file, setCoverId);
                if (useCoverAsThumbnail) {
                    await handleFileUpload(file, setThumbnailId);
                }
            } catch (error) {
                console.error('Error uploading cover:', error);
                setCoverId('');
                setCoverPreview(null);
                if (useCoverAsThumbnail) {
                    setThumbnailId('');
                }
            }
        } else {
            setCoverId('');
            setCoverPreview(null);
            if (useCoverAsThumbnail) {
                setThumbnailId('');
            }
        }
    };
    return (
        <FormAddSeries
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
    );
};

export default AddPostPage;
