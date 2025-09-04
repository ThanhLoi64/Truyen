'use client'
import React, { useState, useEffect } from "react";
import { getCateId, updateCategory } from "@/app/api/user";
import { EDIT_CATEGORY_SUCCES } from "../../../../../../errorConstants";
import { Snackbar, Typography, Container, TextField, Button, Alert } from '@mui/material';

const EditCategoryPage = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [errors, setErrors] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromQuery = searchParams.get('id');
    if (idFromQuery) {
      setId(idFromQuery);
      fetchCategoryData(idFromQuery);
    }
  }, []);

  const fetchCategoryData = async (id) => {
    try {
      const categoryData = await getCateId(id);
      setName(categoryData.name);
      setTitle(categoryData.title);
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'title') {
      setTitle(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !title) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Vui lòng điền vào tất cả các trường.");
      setOpenSnackbar(true);
      return;
    }
    try {
      const categoryData = { id, name, title };
      await updateCategory(id, categoryData);
      setSnackbarSeverity("success");
      setSnackbarMessage(EDIT_CATEGORY_SUCCES);
      setOpenSnackbar(true);
      setErrors([]);
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Lỗi cập nhật danh mục: " + error.message);
      setOpenSnackbar(true);
    }


  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" className="pl-[16rem] pt-3">
      <Typography className="text-center mb-1 mt-2 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
        Chỉnh sửa danh mục
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-3 mt-6 mb-3">
          <TextField
            label="Tên danh mục"
            name="name"
            type="text"
            id="name"
            onChange={handleChange}
            value={name}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mô tả"
            name="title"
            id="title"
            rows={4}
            onChange={handleChange}
            value={title}
            multiline
            fullWidth
            margin="normal"
          />
        </div>
        <Button
          className='bg-[--button] mt-3 hover:bg-[var(--button)] '
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Sửa danh mục
        </Button>
      </form>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert variant="filled" onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditCategoryPage;
