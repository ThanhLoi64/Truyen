"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addUser } from "@/app/api/user";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { EMAIL_INUSE, USER_INUSE, INVALID_EMAIL_ERROR, EMPTY_FIELD_ERROR, PASS_NOMATCH } from "@/app/error/errorConstants";

const AddUserPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    roles: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.userName || !formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.email || !formData.password || !formData.confirmPassword || !formData.roles) {
        setSnackbarSeverity("error");
        setSnackbarMessage(EMPTY_FIELD_ERROR);
        setOpenSnackbar(true);
        return;
      }
      if (!isValidEmail(formData.email)) {
        setSnackbarSeverity("error");
        setSnackbarMessage(INVALID_EMAIL_ERROR);
        setOpenSnackbar(true);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setSnackbarSeverity("error");
        setSnackbarMessage(PASS_NOMATCH);
        setOpenSnackbar(true);
        return;
      }
      const response = await addUser({
        ...formData,
        role: parseInt(formData.roles),
      });
      console.log("Thêm người dùng thành công ", response);
      router.push("/admin/dashboard/users");
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage(`Error adding user: ${error.message}`);
      setOpenSnackbar(true);

      if (error.response && error.response.data) {
        if (error.response.data.Message === "Username already exists") {
          setSnackbarSeverity("error");
          setSnackbarMessage(USER_INUSE);
          setOpenSnackbar(true);
        } else if (error.response.data.Message === "Email already exists") {
          setSnackbarSeverity("error");
          setSnackbarMessage('Email đã có người sử dụng');
          setOpenSnackbar(true);
        } else {
          setSnackbarSeverity("error");
          setSnackbarMessage("Lỗi thêm người dùng: " + error.response.data.Message);
          setOpenSnackbar(true);
        }
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Lỗi thêm người dùng: " + error.message);
        setOpenSnackbar(true);
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const roleOptions = [
    { id: 0, title: "Admin" },
    { id: 1, title: "Staff" },
    { id: 2, title: "Customer" },
    { id: 3, title: "Guest" },
    { id: 4, title: "User" },
  ];

  return (
    <div className="pl-[16rem] py-2">
      <h2 className=" text-center mb-1 mt-2 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
        Thêm người dùng
      </h2>

      <form onSubmit={handleSubmit} className="mt-5">
        <Box className="grid gap-6 mb-6 md:grid-cols-2">
          <TextField
            label="Username"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Họ"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tên"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Số Điện thoại"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mật khẩu"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="roles-label">Role</InputLabel>
            <Select
              labelId="roles-label"
              value={formData.roles}
              onChange={handleChange}
              input={<OutlinedInput id="select-single-role" label="Roles" />}
              name="roles"
            >
              {roleOptions.map((role) => (
                <MenuItem key={role.id} value={role.id.toString()}>
                  {role.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button
          type="submit"
          variant="contained"
          className="text-center bg-[var(--button)] "
          sx={{ mt: 2 }}
        >
          Thêm người dùng
        </Button>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
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
  );
};

export default AddUserPage;
