"use client";
import React, { useState, useEffect } from "react";
import { registerUser } from "../api/user";
import { useRouter } from "next/navigation";
import bannerSpa from "@/app/img/login.jpg";
import {
  EMAIL_ALREADY_IN_USE,
  USER_INUSE,
  EMPTY_FIELD_ERROR,
  INVALID_EMAIL_ERROR,
  PASSWORD_FORMAT_ERROR,
  USERNAME_SPECIAL_CHAR_ERROR,
  PASS_NOTMATCH
} from "../../../errorConstants";
import Image from "next/image";
import { IconButton, TextField, Backdrop, Button, Container, Typography, Box, Grid, Paper, Alert, InputAdornment } from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    retypePassword: "",
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormData({ username: "", password: "" });

    }, 100);
    return () => clearTimeout(timer);
  }, []);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [successBackdropOpen, setSuccessBackdropOpen] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRe, setShowPasswordRe] = useState(false);
  const router = useRouter();
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleShowPassword2 = () => {
    setShowPasswordRe((prev) => !prev);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (value.trim() === "") {
      setError("");
      setUsernameError("");
      return;
    }
    if (name === "password") {
      if (!isValidPassword(value)) {
        setError(PASSWORD_FORMAT_ERROR);
      } else {
        setError("");
      }
    } else if (name === "username") {
      if (!isValidUsername(value)) {
        setUsernameError(USERNAME_SPECIAL_CHAR_ERROR);
      } else {
        setUsernameError("");
      }
    } else if (name === "email") {
      if (!isValidEmail(value)) {
        setError(INVALID_EMAIL_ERROR);
      } else {
        setError("");
      }
    } else {
      setError("");
      setUsernameError("");
    }
  };

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
    return passwordRegex.test(password);
  };

  const isValidUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]*$/;
    return usernameRegex.test(username);
  };

  const isValidEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.retypePassword
    ) {
      setRegistrationError(EMPTY_FIELD_ERROR);
      return;
    }
    if (formData.password !== formData.retypePassword) {
      setRegistrationError(PASS_NOTMATCH);
      return;
    }
    try {
      await registerUser(formData);
      setSuccessBackdropOpen(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data;

        if (typeof errorMessage === 'string') {
          if (errorMessage.includes("EmailAlreadyInUse")) {
            setRegistrationError(EMAIL_ALREADY_IN_USE);
          } else if (errorMessage.includes("is already taken.")) {
            setRegistrationError(USER_INUSE);
          } else {
            setRegistrationError("Đăng ký không thành công. Vui lòng thử lại sau.");
          }
        } else if (errorMessage.Code === "U007" && errorMessage.Message === "EmailAlreadyInUse") {
          setRegistrationError(EMAIL_ALREADY_IN_USE);
        } else if (errorMessage.Code === "DuplicateUserName" && errorMessage.Message.includes("is already taken.")) {
          setRegistrationError(USER_INUSE);
        } else {
          setRegistrationError("Đăng ký không thành công. Vui lòng thử lại sau.");
        }
      } else {
        setRegistrationError("Đăng ký không thành công. Vui lòng thử lại sau.");
      }
    }
  };



  return (
    <Container
      component="section"
      sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          borderRadius: 2,
          width: '100%',
          maxWidth: { xs: '90%', md: '60%' },
          p: 2,
          alignItems: 'center'
        }}
      >
        <Box sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
          <Typography variant="h4" component="h2" gutterBottom className="text-[var(--button)]" fontWeight='bold'>
            ĐĂNG KÝ
          </Typography>
          <Typography variant="body2" component="p" gutterBottom sx={{ mb: 2, color: '#002D74' }}>
            Tạo tài khoản để bắt đầu
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email *"
              variant="outlined"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              autoComplete="off"
              error={error === INVALID_EMAIL_ERROR}
              helperText={error === INVALID_EMAIL_ERROR ? INVALID_EMAIL_ERROR : ""}
            />
            <TextField
              label="Tên đăng nhập *"
              variant="outlined"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              autoComplete="username"
              error={usernameError !== ""}
              helperText={usernameError}
            />
            <TextField
              label="Mật khẩu *"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              error={error === PASSWORD_FORMAT_ERROR}
              helperText={
                error === PASSWORD_FORMAT_ERROR
                  ? "Mật khẩu từ 8-32 kí tự,1 chữ hoa, 1 chữ thường, 1 chữ số và 1 kí tự đặc biệt"
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Nhập lại mật khẩu *"
              variant="outlined"
              type={showPasswordRe ? "text" : "password"}
              name="retypePassword"
              autoComplete="off"
              value={formData.retypePassword}
              onChange={handleChange}
              fullWidth
              error={error === EMPTY_FIELD_ERROR && formData.retypePassword === ""}
              helperText={
                error === EMPTY_FIELD_ERROR && formData.retypePassword === ""
                  ? "Trường này không được để trống"
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword2} edge="end">
                      {showPasswordRe ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                py: 1.5,
                backgroundColor: 'var(--button)',
                '&:hover': {
                  backgroundColor: 'var(--button)',
                }
              }}
            >
              Đăng ký
            </Button>
            {registrationError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {registrationError}
              </Alert>
            )}
          </Box>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' }, flex: 1 }}>
          <Image src={bannerSpa} alt="Banner" layout="responsive" className="rounded-2xl" />
        </Box>
      </Paper>
      {successBackdropOpen && (
        <Backdrop open={true} sx={{ zIndex: 999, color: "#fff", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            Đăng ký thành công
          </Typography>
        </Backdrop>
      )}
    </Container>
  );
};

export default RegisterForm;
