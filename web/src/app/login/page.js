"use client";
import { useState } from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { loginUser } from "../api/user";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import bannerSpa from "@/app/img/login.jpg";
import {
  Alert,
  IconButton,
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Backdrop,
  InputAdornment
} from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  USERNAME_PASSWORD_ERROR,
  INVALID_CREDENTIALS,
  EMPTY_FIELD_ERROR,
  PASSWORD_LENGTH_ERROR,
  PASSWORD_CASE_ERROR,
  PASSWORD_SPECIAL_CHAR_ERROR,
} from "../../../errorConstants";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [LoginError, setLogintrationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors([]);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = [];
    if (!formData.username) {
      newErrors.push(EMPTY_FIELD_ERROR);
    }
    if (!formData.password) {
      newErrors.push(EMPTY_FIELD_ERROR);
    }
    if (formData.password.length < 6) {
      newErrors.push(PASSWORD_LENGTH_ERROR);
    }
    if (!/[A-Z]/.test(formData.password)) {
      newErrors.push(PASSWORD_CASE_ERROR);
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.push(PASSWORD_SPECIAL_CHAR_ERROR);
    }
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(formData);
      if (response.accessToken) {
        const accessTokenExpires = response.expiredDate;
        const refreshTokenExpires = response.refreshTokenExpiredDate;
        document.cookie = `accessToken=${response.accessToken}; path=/; expires=${accessTokenExpires}; `;
        document.cookie = `refreshToken=${response.refreshToken}; path=/; expires=${refreshTokenExpires}; `;
        document.cookie = `roles=${response.roles.join(",")}; path=/; expires=${accessTokenExpires}; `;
        document.cookie = `expiredDate=${response.expiredDate}; path=/; expires=${accessTokenExpires}; `;
        document.cookie = `refreshTokenExpiredDate=${response.refreshTokenExpiredDate}; path=/; expires=${refreshTokenExpires}; `;

        await new Promise((res) => setTimeout(res, 200));

        window.location.reload();
        window.location.href = "/";
      }
    } catch (error) {
      const errorMessage = error?.response?.data;
      if (errorMessage?.Code === "U005" && errorMessage.Message) {
        const bannedUntil = errorMessage.Message.match(
          /banned until (\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2})/
        )[1];
        Swal.fire({
          icon: "warning",
          title: "Tài khoản đã bị cấm",
          text: `Tài khoản đã bị cấm đến ngày ${bannedUntil}`,
        });
      } else if (errorMessage?.Message === "InvalidUserNameOrPassword") {
        setErrors([USERNAME_PASSWORD_ERROR]);
      } else {
        setErrors(error);
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="section"
        sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: 2,
            width: "100%",
            maxWidth: { xs: "90%", md: "60%" },
            p: 2,
          }}
        >
          <Box sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: "bold", color: "var(--button)", mb: 3 }}>
              ĐĂNG NHẬP
            </Typography>

            <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Tên đăng nhập *"
                variant="outlined"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                autoComplete="username"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
              <TextField
                label="Mật khẩu *"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  backgroundColor: "var(--button)",
                  fontSize: "20px",
                  borderRadius: 0,
                  "&:hover": {
                    backgroundColor: "var(--button)",
                  },
                }}
              >
                Đăng nhập
              </Button>
            </Box>

            <div className="w-full max-w-sm mx-auto text-center space-y-[10px] mt-[10px] font-[Inter]">
               <div className="text-right">
              <Link href="/ForgotPasswordEnterEmailPage" className="text-gray-600 text-[17px] hover:underline" legacyBehavior>
                 <a className="text-gray-600 text-[17px] hover:underline">Quên mật khẩu ?</a>
              </Link>
              </div>


              <div className="flex items-center justify-center space-x-4">
                <div className="flex-1 h-px bg-gray-400"></div>
                <span className="text-gray-500 text-[10px] tracking-wide">ĐĂNG NHẬP BẰNG</span>
                <div className="flex-1 h-px bg-gray-400"></div>
              </div>

              <div className="flex justify-center space-x-4">
                <button className="flex items-center justify-center border border-blue-500 text-blue-500 w-[132px] h-[21px] px-4 py-2 rounded hover:bg-blue-50 transition text-[10px]">
                  <FaFacebook className="mr-2 text-[10px]" />
                  Facebook
                </button>
                <button className="flex items-center justify-center w-[132px] h-[21px] border border-red-500 text-red-500 rounded hover:bg-red-50 transition text-[10px]">
                  <FaGoogle className="mr-1 text-[10px]" />
                  Google
                </button>
              </div>
            </div>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ fontSize: "17px" }}>
                Bạn chưa có tài khoản?
              </Typography>
              <Link href="/register" passHref>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    height: "22px",
                    fontSize: "10px",
                    borderColor: "var(--button)",
                    color: "var(--button)",
                    borderRadius: 0,
                    "&:hover": {
                      borderColor: "var(--buttonSoft)",
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  Đăng ký
                </Button>
              </Link>
            </Box>

            {errors.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="error" sx={{ mb: 1, alignItems: "center" }}>
                  {errors[0]}
                </Alert>
              </Box>
            )}
          </Box>

          <Box sx={{ display: { xs: "none", md: "block" }, flex: 1 }}>
            <Image src={bannerSpa} alt="Banner" layout="responsive" className="rounded-2xl" />
          </Box>
        </Paper>

        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
