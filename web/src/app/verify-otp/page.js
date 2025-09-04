'use client'
import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Container, Typography, Alert, TextField, styled } from "@mui/material";
import { useSearchParams, useRouter } from 'next/navigation';

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        borderRadius: '20px',
        width: '3.5rem',
        height: '3.5rem',
        padding: '0',

        '& fieldset': {
            borderColor: 'var(--button)',
            borderWidth: '2px',
            borderRadius: '20px',
            borderStyle: 'solid',
        },
        '&:hover fieldset': {
            borderColor: 'var(--button)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'var(--button)',
        },
    },
    '& input': {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: 'rgba(226, 198, 150, 1)',
    },
});

const OTPPage = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [resendTimer, setResendTimer] = useState(30);
    const inputRefs = useRef([]);
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const router = useRouter();  

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => {
                setResendTimer(resendTimer - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleOTPChange = (index, value) => {
        if (isNaN(value)) return;
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '' && index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const enteredOTP = otp.join('');

        if (enteredOTP.length !== 6) {
            setError("Vui lòng nhập đầy đủ mã OTP.");
            return;
        }

        try {
            
            setSuccessMessage("Xác thực OTP thành công!");
            setError("");

          
            router.push('/ChangePasswordPage');  
        } catch (err) {
            setError("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
        }
    };

    const handleResendOTP = () => {
        setResendTimer(30);
        setSuccessMessage("");
        setError("");
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#FAF5EF">
            <Container maxWidth="sm">
                <Box bgcolor="white" p={4} borderRadius={1} boxShadow={0} >
                    <Typography variant="h5" align="center" gutterBottom>
                        Mời bạn nhập mã OTP
                    </Typography>
                    <Typography variant="body2" align="center" color="textSecondary">
                        Hệ thống đã gửi mã OTP qua email {email} mời bạn nhập vào các trường bên dưới.
                    </Typography>

                    <Box mt={3} display="flex" justifyContent="space-around">
                        {otp.map((digit, index) => (
                            <StyledTextField
                                key={index}
                                inputRef={(el) => (inputRefs.current[index] = el)}
                                value={digit}
                                onChange={(e) => handleOTPChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                variant="outlined"
                                InputProps={{
                                    maxLength: 1,
                                    style: { textAlign: 'center', width: '3.5rem', height: '3.5rem' }
                                }}
                                style={{ width: '3.5rem' }}
                            />
                        ))}
                    </Box>

                    <Box mt={2} textAlign="center">
                        {resendTimer > 0 ? (
                            <Typography variant="body2" style={{ color: 'rgba(128, 128, 128, 1)' }}>
                                Gửi lại OTP ({resendTimer})
                            </Typography>
                        ) : (
                            <Button color="primary" onClick={handleResendOTP} disabled={resendTimer > 0}>
                                Gửi lại OTP
                            </Button>
                        )}
                    </Box>

                    <Typography variant="body2" align="center" color="textSecondary" mt={2}>
                        Để đăng nhập tiếp tục vào tài khoản sau khi lấy lại mật khẩu bạn cần chấp nhận tất cả <span style={{ color: 'rgba(226, 198, 150, 1)' }}>điều khoản & điều kiện</span> để sử dụng
                    </Typography>

                    {error && (
                        <Box mt={2}>
                            <Alert severity="error">{error}</Alert>
                        </Box>
                    )}

                    {successMessage && (
                        <Box mt={2}>
                            <Alert severity="success">{successMessage}</Alert>
                        </Box>
                    )}

                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, backgroundColor: 'var(--button)', '&:hover': { backgroundColor: 'var(--button)' } }}
                        onClick={handleSubmit}
                    >
                        Xác nhận
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default OTPPage;