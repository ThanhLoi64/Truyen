
'use client'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { apiClientUser } from "./apiClient";


export const postAct = async (data) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.post('/posts/act', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserInfo = async () => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get('/user/info');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const checkLoginStatus = async (setIsLoggedIn, setUserName, setRoles, setUserId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get('/user/check-login');
        if (response.data.userName) {
            setIsLoggedIn(true);
            setUserName(response.data.userName);
            setRoles(response.data.roles || []);
            if (setUserId && response.data.userId) {
                setUserId(response.data.userId);
            }
        }
    } catch (error) {
        console.error("Error checking login status:", error);

    }
};

export const fetchView = async (postItemHashId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.post(`/posts/view/${postItemHashId}`);
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching chapter detail:', error);
        throw error;
    }
};

export const editUser = async (id, oldPassword, newPassword, firstName, lastName, dateOfBirth, roles) => {
    try {
        const axiosInstance = await apiClientUser();

        const response = await axiosInstance.put(
            '/user/edit-info',
            {
                id, oldPassword, newPassword, firstName, lastName, dateOfBirth, roles
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.put('/user/change-password', { oldPassword, newPassword, confirmPassword, },);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const listBookUpdateNovels = async () => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get('/posts/latest?Page=1&PageSize=10');
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const fetchTopSeries = async () => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get('/posts/topvote?Page=1&PageSize=10');
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const fetchTopView = async () => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get('/posts/topview?Page=1&PageSize=10');
        return response.data;
    } catch (error) {
        throw error;
    }
};


// const changePassword = async (accessToken, oldPassword, newPassword, confirmPassword) => {
//     try {
//         const axiosInstance = await apiClientUser();
//         const response = await axiosInstance.put(
//             '/user/change-password',
//             {
//                 oldPassword,
//                 newPassword,
//                 confirmPassword,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//             }
//         );
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };








const fetchNovelDetail = async (novelId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts/chapter?novelId=${novelId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


const fetchNovelCoverImg = async (novelId) => {
    try {
        const response = await axios.get(`/posts/${novelId}`);

        if (!response.data || !response.data.coverImg) {
            throw new Error('Invalid response format');
        }

        return response.data.coverImg.url;
    } catch (error) {
        console.error('Error fetching novel cover image:', error);
        throw error;
    }
};



const fetchChapterList = async (hashId, page = 1, pageSize = 100) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts/list-chapter`, {
            params: {
                HashId: hashId,
                Page: page,
                PageSize: pageSize
            }
        });

        if (!response.data || !response.data.items) {
            throw new Error('Invalid response format');
        }

        return response.data.items;
    } catch (error) {
        throw error;
    }
};

export const CategoryListCate = async (CategoryId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts/cate?CategoryId=${CategoryId}`);

        if (!response.data || !response.data.items) {
            throw new Error('Invalid response format');
        }

        return response.data.items;
    } catch (error) {
        throw error;
    }
};

export const CategoryList = async (CategoryId) => {
    try {
        const axiosInstance = await apiClientUser();
        const url = CategoryId ? `/posts/cate?CategoryId=${CategoryId}` : '/posts/cate';
        const response = await axiosInstance.get(url);

        if (response.data && Array.isArray(response.data.items)) {
            return response.data;
        } else {
            throw new Error('Invalid data format from API');
        }
    } catch (error) {
        console.error('Error fetching categories:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const fetch5Categories = async () => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get('/categories/top');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchAllCategories = async () => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get('/categories');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchChapterDetail = async (hashId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts/read/${hashId}`);
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching chapter detail:', error);
        throw error;
    }
};
export const votePost = async (novelId) => {
    try {
        // const userToken = await AsyncStorage.getItem('userToken');
        // if (!userToken) {
        //     throw new Error('User token not found');
        // }
        // const axiosInstance = axios.create({
        //     baseURL: process.env.PUBLIC_API_URL,
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${userToken}`
        //     }
        // });
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.post(`/votes/${novelId}`);
        return response.data;
    } catch (error) {
        return null;
    }
};
export const isVoteGet = async (postId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts/id/${postId}`);
        return response.data;
    } catch (error) {
        return null;
    }
};

export const searchPost = async (keyword, page) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts/search?Keyword=${encodeURIComponent(keyword)}&Page=${page}`);
        return response.data;
    } catch (error) {
        console.error('Error searching post by keyword:', error);
        throw error;
    }
};

export const searchAllPages = async (keyword) => {
    let allResults = [];
    let currentPage = 1;
    let totalPages = 1;

    while (currentPage <= totalPages) {
        try {
            const data = await searchPost(keyword, currentPage);
            if (data.items && Array.isArray(data.items)) {
                allResults = allResults.concat(data.items);
            }
            totalPages = data.totalPages || 1;
            currentPage += 1;
        } catch (error) {
            console.error('Error fetching all pages:', error);
            throw error;
        }
    }

    return allResults;
};

export { fetchNovelDetail, fetchChapterList, fetchNovelCoverImg, fetch5Categories };
