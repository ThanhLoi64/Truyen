'use client';
import React, { useState, useEffect } from "react";
import { editUser, logoutAllUser } from "../api/user";
import { checkLoginStatus } from "../api/user";
import Cookies from 'js-cookie';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';

const EditUserPage = () => {
    const [id, setId] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [roles, setRoles] = useState([""]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            checkLoginStatus(setIsLoggedIn, setUserName, setRoles, setId);
        } else {
            setError("Không có accessToken.");
        }
    }, []);

    const formatDateForAPI = (date) => {
        if (!date) return "";
        const isoDate = new Date(date).toISOString();
        return isoDate;
    };

    const handleLogout = async () => {
        const accessToken = Cookies.get('accessToken');
        if (!accessToken) {
            setError("Không có accessToken.");
            return;
        }
        try {
            await logoutAllUser(accessToken);
        } catch (error) {
            setError("Lỗi. Vui lòng thử lại sau.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = Cookies.get('accessToken');
        if (!accessToken) {
            setError("Không có accessToken.");
            return;
        }
        const formattedDateOfBirth = formatDateForAPI(dateOfBirth);
        try {
            await editUser(accessToken, id, oldPassword, newPassword, firstName, lastName, formattedDateOfBirth, roles);
            setSuccessMessage("Chỉnh sửa thông tin thành công!");
            setNewPassword('');
            setOldPassword('');
            setFirstName('');
            setLastName('');
            setDateOfBirth('');
            setError('');
        } catch (error) {
            setError("Lỗi chỉnh sửa thông tin. Vui lòng thử lại sau.");
        }
    };

    return (
        <Container className="bg-[#F8F7F4]" maxWidth="sm">
            <Box className="rounded" mt={8} p={3} boxShadow={3} bgcolor="white">
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Chỉnh sửa thông tin người dùng
                </Typography>
                <form onSubmit={handleSubmit}>
                    <div className="flex">
                        <div className="pr-3">
                            <TextField
                                margin="normal"
                                fullWidth
                                label="ID"
                                id="ID"
                                value={id}
                                hidden
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Mật khẩu cũ"
                                type="password"
                                id="oldPassword"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Mật khẩu mới"
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Tên"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="pl-3">
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Họ"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Ngày sinh"
                                type="date"
                                id="dateOfBirth"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Vai trò"
                                id="roles"
                                value={roles.join(',')}
                                InputProps={{
                                    readOnly: true,
                                }}
                                onChange={(e) => setRoles(e.target.value.split(',').map(role => role.trim()))}
                            />
                        </div>
                    </div>


                    {error && <Alert severity="error" style={{ marginTop: '16px' }}>{error}</Alert>}
                    {successMessage && <Alert severity="success" style={{ marginTop: '16px' }}>{successMessage}</Alert>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '16px' }}
                    >
                        Xác nhận thay đổi
                    </Button>
                    <Button
                        className="bg-[--buttonRed] hover:bg-red-600"
                        type="button"
                        onClick={handleLogout}
                        fullWidth
                        variant="contained"
                        style={{ marginTop: '16px' }}
                    >
                        Thoát ra tất cả các phiên đăng nhập
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default EditUserPage;
