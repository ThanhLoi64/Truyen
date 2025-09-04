
import axios from "axios";
const apiClient = axios.create({
    baseURL: process.env.PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const refreshTokenAPI = async (refreshToken) => {
    try {
        const response = await apiClient.get(`/user/refresh-token?refreshToken=${encodeURIComponent(refreshToken)}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { apiClient };