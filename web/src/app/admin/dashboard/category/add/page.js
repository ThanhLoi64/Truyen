'use client'
import React, { useState, useEffect } from "react";
import { addCategory } from "@/app/api/user";
import { Snackbar, Typography, Container, TextField, Button, Alert } from '@mui/material';

const AddCategoryPage = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !title) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Vui lòng điền vào tất cả các trường.");
      setOpenSnackbar(true);
      return;
    }

    try {
      await addCategory(name, title);
      setSnackbarMessage("Thêm danh mục thành công!");
      setName('');
      setTitle('');
      setError('');
      setOpenSnackbar(true);
      setSnackbarSeverity("success");
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.Message;
        if (errorMessage.includes("existing")) {
          setSnackbarSeverity("error");
          setSnackbarMessage("Danh mục đã tồn tại. Vui lòng chọn tên khác.");
          setOpenSnackbar(true);
        } else {
          setError("Lỗi thêm danh mục. Vui lòng thử lại sau.");
          setOpenSnackbar(true);
          setSnackbarSeverity("error");
        }
      } else {
        setError("Lỗi thêm danh mục. Vui lòng thử lại sau.");
        setOpenSnackbar(true);
        setSnackbarSeverity("error");
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" className="pl-[16rem] pt-3">
      <Typography className="text-center mb-1 mt-2 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
        Thêm Danh Mục Mới
      </Typography>
      <form onSubmit={handleSubmit} className="">
        <div className="flex flex-wrap gap-3 mt-6 mb-3">
          <TextField
            label="Tên Danh Mục"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Mô tả"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          className="bg-[var(--button)] hover:bg-[var(--button)]"
          fullWidth
          sx={{ mt: 2 }}
        >
          Thêm Danh Mục
        </Button>
      </form>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert variant="filled" onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container >
  );
};

export default AddCategoryPage;
