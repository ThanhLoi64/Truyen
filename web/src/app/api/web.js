
'use client'
import { apiClientUser } from './api-client';



export const fetchChapterListBottom = async (novelId, page = 1) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts/list-chapter?hashId=${novelId}&Page=${page}&PageSize=100`);

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
  
export const fetchChapterList = async (novelId, page = 1) => {
    try {
        const axiosInstance = await apiClientUser();
        const response = await axiosInstance.get(`/posts/list-chapter?hashId=${novelId}&Page=${page}&PageSize=100`);

        if (!response.data || !response.data.items) {
            throw new Error('Invalid response format');
        }

        return response.data.items;
    } catch (error) {
        throw error;
    }
};