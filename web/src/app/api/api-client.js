// lib/api-client.js
'use client';
import axios from 'axios';
import { refreshTokenAPI } from './user';
import Cookies from "js-cookie";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',

    },
});


const apiClientUser = async () => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    const accessTokenExpriedDate = Cookies.get("expiredDate");
    const expiredDate = accessTokenExpriedDate == null ? new Date() : new Date(accessTokenExpriedDate)
    if ((!accessToken || expiredDate <= new Date()) && refreshToken) {
        try {
            const responseData = await refreshTokenAPI(refreshToken);
            if (responseData.accessToken) {
                const newAccessToken = responseData.accessToken;
                const accessTokenExpires = new Date(responseData.expiredDate).toUTCString(); // 1 phút
                const refreshTokenExpires = new Date(responseData.refreshTokenExpiredDate).toUTCString(); // 7 ngày
                document.cookie = `accessToken=${newAccessToken}; path=/; expires=${accessTokenExpires}; `;
                document.cookie = `refreshToken=${refreshToken}; path=/; expires=${refreshTokenExpires}; `;
                document.cookie = `roles=${responseData.roles.join(',')}; path=/; expires=${accessTokenExpires}; `;
                document.cookie = `expiredDate=${responseData.expiredDate}; path=/; expires=${accessTokenExpires}; `;
                document.cookie = `refreshTokenExpiredDate=${responseData.refreshTokenExpiredDate}; path=/; expires=${refreshTokenExpires}; `;

                return axios.create({
                    baseURL: process.env.NEXT_PUBLIC_API_URL,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newAccessToken}`
                    },
                });
            } else {
                window.location.href = '/login';
                return null;
            }
        } catch (error) {
            console.error('Error refreshing access token:', error);
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            Cookies.remove("expiredDate");
            Cookies.remove("roles");
            Cookies.remove("refreshTokenExpiredDate");
            window.location.href = '/login';
            return null;
        }
    }

    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    });
};

export { apiClient, apiClientUser };
