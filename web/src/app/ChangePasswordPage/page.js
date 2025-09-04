
"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import bannerSpa from "@/app/img/login.jpg";
import { Alert, TextField, Button, Container, Typography, Box, Paper, CircularProgress, Backdrop, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Swal from "sweetalert2";

const ChangePasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChangeNewPassword = (e) => {
        setNewPassword(e.target.value);
        setError('');
    };

    const handleChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        setError('');
    };

    const handleToggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ mật khẩu.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu mới và mật khẩu xác nhận không khớp.');
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
           

            Swal.fire({
                title: 'Thành công!',
                text: 'Đổi mật khẩu thành công!',
                icon: 'success',
                confirmButtonText: 'Ok'
            }).then(() => {
                router.push('/login');
            });

        }, 1500);
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
                }}
            >
                <Box sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '25px',
                            fontWeight: 'bold',
                            color: 'var(--button)',
                            marginBottom: '30px',
                        }}
                    >
                        XÁC NHẬN MẬT KHẨU
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Nhập mật khẩu mới *"
                            variant="outlined"
                            type={showNewPassword ? 'text' : 'password'}
                            name="newPassword"
                            value={newPassword}
                            onChange={handleChangeNewPassword}
                            fullWidth
                            autoComplete="new-password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleToggleNewPasswordVisibility}
                                            edge="end"
                                        >
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 0,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderRadius: 0,
                                },
                                '& .MuiInputLabel-root': {
                                    borderRadius: 0,
                                },
                            }}
                        />
                        <TextField
                            label="Xác nhận mật khẩu mới *"
                            variant="outlined"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleChangeConfirmPassword}
                            fullWidth
                            autoComplete="confirm-password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleToggleConfirmPasswordVisibility}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 0,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderRadius: 0,
                                },
                                '& .MuiInputLabel-root': {
                                    borderRadius: 0,
                                },
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
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '20px',
                                borderRadius: 0,
                                '&:hover': {
                                    backgroundColor: 'var(--button)',
                                },
                            }}
                        >
                            XÁC NHẬN
                        </Button>
                    </Box>

                    {error && (
                        <Box sx={{ mt: 2 }}>
                            <Alert severity="error" sx={{ mb: 1, alignItems: 'center' }}>
                                {error}
                            </Alert>
                        </Box>
                    )}
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'block' }, flex: 1 }}>
                    <Image src={bannerSpa} alt="Banner" layout="responsive" className="rounded-2xl" />
                </Box>
            </Paper>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    );
};

export default ChangePasswordPage;