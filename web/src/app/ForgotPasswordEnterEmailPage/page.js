"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Swal from "sweetalert2";
import bannerSpa from "@/app/img/login.jpg";
import { Alert, TextField, Button, Container, Typography, Box, Paper, CircularProgress, Backdrop } from '@mui/material';

const ForgotPasswordEnterEmailPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        setEmail(e.target.value);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError('Vui lòng nhập email của bạn.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Vui lòng nhập một địa chỉ email hợp lệ.');
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);

            router.push(`/verify-otp?email=${email}`);

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
                        NHẬP EMAIL CỦA BẠN
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Email tài khoản *"
                            variant="outlined"
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            fullWidth
                            autoComplete="email"
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

export default ForgotPasswordEnterEmailPage;