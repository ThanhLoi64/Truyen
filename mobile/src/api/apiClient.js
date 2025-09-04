import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { refreshTokenAPI } from './apiRefreshToken';
const apiClient = axios.create({
    baseURL: process.env.PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


const apiClientUser = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const accessTokenExpiredDate = await AsyncStorage.getItem('expiredDate');
    const expiredDate = accessTokenExpiredDate == null ? new Date() : new Date(accessTokenExpiredDate)
    if ((!accessToken || expiredDate <= new Date()) && refreshToken) {
        try {
            const responseData = await refreshTokenAPI(refreshToken);
            if (responseData.accessToken) {
                const newUserToken = responseData.accessToken;
                await AsyncStorage.setItem('accessToken', newUserToken)
                await AsyncStorage.setItem('refreshToken', responseData.refreshToken)
                await AsyncStorage.setItem('roles', responseData.roles.join(','))
                await AsyncStorage.setItem('expiredDate', responseData.expiredDate)
                await AsyncStorage.setItem('refreshTokenExpiredDate', responseData.refreshTokenExpiredDate)
                return axios.create({
                    baseURL: process.env.PUBLIC_API_URL,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newUserToken}`
                    },
                });
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error refreshing access token:', error);
            AsyncStorage.removeItem('accessToken');
            AsyncStorage.removeItem('refreshToken')
            AsyncStorage.removeItem('roles',)
            AsyncStorage.removeItem('expiredDate');
            AsyncStorage.removeItem('refreshTokenExpiredDate')
            return null;
        }
    }
    return axios.create({
        baseURL: process.env.PUBLIC_API_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    });
};
export { apiClientUser, apiClient };