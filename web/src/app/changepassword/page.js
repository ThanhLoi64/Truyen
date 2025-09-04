
'use client'
import React, { useState } from "react";
import Cookies from 'js-cookie';
import {
  PASSWORD_OLD_ERR,
  PASSWORD_LENGTH_ERROR,
  PASSWORD_CASE_ERROR,
  PASSWORD_SPECIAL_CHAR_ERROR,
  EMPTY_FIELD_ERROR,
  PASS_NOTMATCH,
  NEWPASSWORD_NOT_SAME_OLD
} from '../../../errorConstants';
import { Box, Button, Container, TextField, Typography, Alert, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePasswordVisibility = (type) => {
    if (type === 'old') {
      setShowOldPassword((prev) => !prev);
    } else if (type === 'new') {
      setShowNewPassword((prev) => !prev);
    } else if (type === 'confirm') {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      setError("Bạn chưa đăng nhập");
      return;
    }

    const newErrors = [];
    if (!oldPassword || !newPassword || !confirmPassword) {
      newErrors.push(EMPTY_FIELD_ERROR);
    }
    if (newPassword !== confirmPassword) {
      newErrors.push(PASS_NOTMATCH);
    }
    if (newPassword.length < 6) {
      newErrors.push(PASSWORD_LENGTH_ERROR);
    }
    if (!/[A-Z]/.test(newPassword)) {
      newErrors.push(PASSWORD_CASE_ERROR);
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      newErrors.push(PASSWORD_SPECIAL_CHAR_ERROR);
    }
    if (newPassword === oldPassword) {
      newErrors.push(NEWPASSWORD_NOT_SAME_OLD);
    }
    if (newErrors.length > 0) {
      setErrors(newErrors);
      setError(newErrors[0]); // Hiển thị lỗi đầu tiên trong danh sách lỗi
      return;
    }
    try {
      // Gọi hàm thay đổi mật khẩu ở đây
      setSuccessMessage("Thay đổi mật khẩu thành công!");
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors([]);
      setError('');
    } catch (error) {
      setError(PASSWORD_OLD_ERR);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="90vh" bgcolor="gray.100">
      <Container maxWidth="sm">
        <Box bgcolor="white" p={6} borderRadius={2} boxShadow={3}>
          <Typography variant="h4" align="center" gutterBottom>
            Thay đổi mật khẩu
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nhập mật khẩu cũ *"
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setError(''); 
              }}
              fullWidth
              margin="normal"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleChangePasswordVisibility('old')} edge="end">
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Mật khẩu mới *"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError(''); 
              }}
              fullWidth
              margin="normal"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleChangePasswordVisibility('new')} edge="end">
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Nhập lại mật khẩu mới *"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(''); // Xóa lỗi khi người dùng bắt đầu nhập lại
              }}
              fullWidth
              margin="normal"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleChangePasswordVisibility('confirm')} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="error" sx={{ mb: 1 }}>
                  {error}
                </Alert>
              </Box>
            )}
            {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: 'var(--button)',
                '&:hover': {
                  backgroundColor: 'var(--button)',
                }
              }}
            >
              Xác nhận thay đổi
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default ChangePasswordPage;
