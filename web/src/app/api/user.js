
'use client'
import { apiClient } from './api-client';
import { apiClientUser } from './api-client';
import Cookies from "js-cookie";

const registerUser = async (formData) => {
    try {
        const response = await apiClient.post('/user/register', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
const loginUser = async (formData) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.post('/user/login', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const changePassword = async (accessToken, oldPassword, newPassword, confirmPassword) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.put(
            '/user/change-password',
            {
                oldPassword,
                newPassword,
                confirmPassword,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
const editUser = async (accessToken, id, oldPassword, newPassword, firstName, lastName, dateOfBirth, roles) => {
    try {
        const axiosInstance = await apiClientUser();

        const response = await axiosInstance.put(
            '/user/edit-info',
            {
                id,
                oldPassword,
                newPassword,
                firstName,
                lastName,
                dateOfBirth,
                roles
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};
const checkLoginStatus = async (setIsLoggedIn, setUserName, setRoles, setUserId) => {
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
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("expiredDate");
        Cookies.remove("roles");
        Cookies.remove("refreshTokenExpiredDate");
     
    }
};
const logoutAllUser = async (accessToken) => {
    try {
        const axiosInstance = await apiClientUser();

        const response = await axiosInstance.put(
            '/user/logout-all',
            {

            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("expiredDate");
        Cookies.remove("roles");
        Cookies.remove("refreshTokenExpiredDate");
        window.location.href = '/login';
        return response.data;
    } catch (error) {
        throw error;
    }
};
const fetchUserList = async (page) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/admin/user?page=${page}&pageSize=10`,);
        return response.data;
    } catch (error) {
        throw error;
    }
};
const fetchListBook = async (page) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts?page=${page}&pageSize=100`,);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const AdminfetchListBook = async (page) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/admin/post?page=${page}&pageSize=100`,);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const listBookUpdateNovels = async (page) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts/latest?page=${page}&pageSize=100`,);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const BookUpdateNovels = async (id) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts/latest/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const SeriesDetailBook = async (hashId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts/${hashId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.delete(`/admin/user?id=${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const deleteSeriesAdmin = async (id) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.delete(`/admin/post/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const deleteSeriesUser = async (id) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.delete(`/posts/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const editSeriesAdmin = async (postData, postId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.put(`/admin/post/${postId}`, postData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const editSeriesUser = async (postData, postId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.put(`/posts/${postId}`, postData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
const updateAdminUser = async (id, userData) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.put(`/admin/user/edit-user?id=${encodeURIComponent(id)}`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
const refreshTokenAPI = async (refreshToken) => {
    try {
        const response = await apiClient.get(`/user/refresh-token?refreshToken=${encodeURIComponent(refreshToken)}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
// Fetch totalItems from API
const fetchTotalItems = () => {
    return apiClientUser().then(axiosInstance => {
        return axiosInstance.get('/admin/user?')
            .then(response => response.data.totalItems)
            .catch(error => {
                console.error('Error fetching total items:', error);
                throw error;
            });
    });
};
const fetchNewCustomerCount = () => {
    return apiClientUser().then(axiosInstance => {
        return axiosInstance.get('/admin/user/dashboard-info')
            .then(response => response.data.newCustomerCount)
            .catch(error => {
                console.error('Error fetching new customer count:', error);
                throw error;
            });
    });
};
const addUser = async (userData) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.post('/admin/user/add-user', userData);
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

const addCategory = async (name, title) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.post(`/admin/category?name=${encodeURIComponent(name)}&title=${encodeURIComponent(title)}`);
        return response.data;
    } catch (error) {
        console.error('Error adding category:', error.response ? error.response.data : error.message);
        throw error;
    }
};



const addPostUser = async (postData) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.post('/posts', postData);
        return response.data;
    } catch (error) {
        console.error('Error adding post:', error.response ? error.response.data : error.message);
        throw error;
    }
};


const searchUserByPhoneNumber = async (phoneNumber) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/admin/user?PhoneNumber=${encodeURIComponent(phoneNumber)}`);
        return response.data;
    } catch (error) {
        console.error('Error searching user by phone number:', error);
        throw error;
    }
};
const searchUserByName = async (searchName) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/admin/user?SearchName=${encodeURIComponent(searchName)}`);
        console.log("searchUserByName response:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error searching user by name:', error);
        throw error;
    }
};
const searchUserByRole = async (role) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/admin/user?Roles=${encodeURIComponent(role)}`);
        console.log("searchUserByRole response:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error searching user by role:', error);
        throw error;
    }
};
const putBannedUser = async (id) => {
    try {
        const axiosInstance = await apiClientUser();
        const encodedId = encodeURIComponent(id);
        const response = await axiosInstance.put(`/admin/user/ban-user?id=${encodedId}&ban=true`);
        console.log("putBannedUser response:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error banning user:', error);
        throw error;
    }
};

const putUnBannedUser = async (id) => {
    try {
        const axiosInstance = await apiClientUser();
        const encodedId = encodeURIComponent(id);
        const response = await axiosInstance.put(`/admin/user/ban-user?id=${encodedId}&ban=false`);
        console.log("putBannedUser response:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error banning user:', error);
        throw error;
    }
};

export const ChapterHideAdmin = async (postItemId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.put(`/admin/post/chapter/hide-unhide/${postItemId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const ChapterHideUser = async (postItemId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.put(`/posts/chapter/hide-unhide/${postItemId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
const fetchCategoryList = async (page) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/admin/category?Page=${page}&PageSize=10`);
        console.log('API response:', response.data);

        if (!response.data || !Array.isArray(response.data.items)) {
            throw new Error('Invalid data format returned from API');
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching category list:', error.response ? error.response.data : error.message);
        throw new Error('Could not fetch category list. Please try again later.');
    }
};

const updateCategory = async (id, categoryData) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.put(`/admin/category?id=${encodeURIComponent(id)}`, categoryData);
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};
const categoryManage = async () => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.put(`/admin/category/active-deactive?id=${encodeURIComponent(id)}`, categoryData);
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error add chapter:', error);
        throw error;
    }
};
const uploadFile = async (formData) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.post('/media-file/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};
const UserSeriesList = async (page) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts?Page=${page}&PageSize=10`);
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching category list:', error.response ? error.response.data : error.message);
        throw new Error('Could not fetch category list. Please try again later.');
    }
};
const ChapterList = async (postId, page) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts/chapter`, {
            params: {
                PostId: postId,
                Page: page,
                PageSize: 10
            }
        });
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching chapter list:', error.response ? error.response.data : error.message);
        throw new Error('Could not fetch chapter list. Please try again later.');
    }
};
export const AdminChapterList = async (postId, page, getIsDeleted = false) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/admin/post/chapter`, {
            params: {
                PostId: postId,
                Page: page,
                PageSize: 10,
                GetIsDeleted: getIsDeleted
            }
        });
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching chapter list:', error.response ? error.response.data : error.message);
        throw new Error('Could not fetch chapter list. Please try again later.');
    }
};



const addAdminPost = async (postData) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.post('/admin/post', postData);
        return response.data;
    } catch (error) {
        console.error('Error adding post:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const getCategories = async () => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get('/admin/category', {
            params: {
                Page: 1,
                PageSize: 100,

            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error.response ? error.response.data : error.message);
        throw error;
    }
};


export const fetchUserCategoryList = async () => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get('/categories');
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching category list:', error.response ? error.response.data : error.message);
        throw new Error('Could not fetch category list. Please try again later.');
    }
};
const addChapterToSeries = async (chapterData) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.post(`/posts/chapter`, chapterData);
        return response.data;
    } catch (error) {
        console.error('Error adding chapter:', error);
        throw error;
    }
};
export const addChapterToSeriesAdmin = async (chapterData) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.post(`/admin/post/chapter`, chapterData);
        return response.data;
    } catch (error) {
        console.error('Error adding chapter:', error);
        throw error;
    }
};
export const userPost = async (postData) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.post(`/posts`, postData);
        return response.data;
    } catch (error) {
        console.error('Error adding chapter:', error);
        throw error;
    }
};
export const getPostId = async (postId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`posts/id/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching post:", error);
        throw error;
    }
};
export const getPostIdAdmin = async (postId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/admin/post/id/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching post:", error);
        throw error;
    }
};

export const getCateId = async (CateId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/admin/category/${CateId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching post:", error);
        throw error;
    }
};

export const getCategoriesId = async (CateId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/categories/${CateId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching post:", error);
        throw error;
    }
};

export const DeleteChapter = async (id) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.delete(`posts/chapter/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting chapter:", error);
        throw error;
    }
};

export const AdminDeleteChapter = async (id) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.delete(`/admin/post/chapter/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting chapter:", error);
        throw error;
    }
};

export const GetEditChapter = async (postItemId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`posts/chapter/${postItemId}`);
        return response.data;
    } catch (error) {
        console.error("Error get edit chapter:", error);
        throw error;
    }
};

export const GetAdminEditChapter = async (postItemId) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/admin/post/chapter/${postItemId}`);
        return response.data;
    } catch (error) {
        console.error("Error get edit chapter:", error);
        throw error;
    }
};

export const EditChapter = async (postItemId, chapterData) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.put(`posts/chapter/${postItemId}`, chapterData);
        return response.data;
    } catch (error) {
        console.error("Error put edit chapter:", error);
        throw error;
    }
};

export const AdminEditChapter = async (postItemId, chapterData) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.put(`/admin/post/chapter/${postItemId}`, chapterData);
        return response.data;
    } catch (error) {
        console.error("Error put edit chapter:", error);
        throw error;
    }
};

export const fetchChapterList = async (novelId, page = 1) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts/list-chapter?PostId=${novelId}&Page=${page}&PageSize=100`);

        if (!response.data || !response.data.items) {
            throw new Error('Invalid response format');
        }

        return response.data.items;
    } catch (error) {
        throw error;
    }
};
export const fetchTopView = async (novelId, page = 1) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts/topview?PostId=${novelId}&Page=${page}&PageSize=100`);

        if (!response.data || !response.data.items) {
            throw new Error('Invalid response format');
        }

        return response.data.items;
    } catch (error) {
        throw error;
    }
};
export const fetchTopSeries = async (novelId, page = 1) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts/topvote?PostId=${novelId}&Page=${page}&PageSize=100`);

        if (!response.data || !response.data.items) {
            throw new Error('Invalid response format');
        }

        return response.data.items;
    } catch (error) {
        throw error;
    }
};

export const fetchChapterListBottom = async (novelId, page = 1) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts/list-chapter?PostId=${novelId}&Page=${page}&PageSize=100`);

        if (!response.data || !response.data.items) {
            throw new Error('Invalid response format');
        }

        return response.data.items;
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
export const updateCategoryStatus = async (id, isActived) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.put(`/admin/category/active-deactive?id=${id}`,isActived );
        return response.data;
    } catch (error) {
        console.error("Error updating category status:", error);
        throw error;
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
            allResults = allResults.concat(data.items);
            totalPages = data.totalPages;
            currentPage += 1;
        } catch (error) {
            console.error('Error fetching all pages:', error);
            throw error;
        }
    }

    return allResults;
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


export {
    uploadFile,
    registerUser, loginUser, refreshTokenAPI, fetchUserList,
    logoutAllUser,
    deleteUser, changePassword, checkLoginStatus, addUser, fetchNewCustomerCount,
    fetchTotalItems, searchUserByPhoneNumber, searchUserByName,
    searchUserByRole, updateAdminUser, editUser, putBannedUser, putUnBannedUser,
    fetchListBook, fetchCategoryList, updateCategory, addCategory, categoryManage,
    addPostUser, getCategories, UserSeriesList, ChapterList, addAdminPost, addChapterToSeries
};
