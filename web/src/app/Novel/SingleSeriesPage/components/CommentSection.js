"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Avatar, IconButton, TextField, InputAdornment } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

async function checkLoginStatus() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        isLoggedIn: true,
        userName: "BaoAnhAdmin",
        roles: [],
        avatarUrl: "/img.jpg"
    };
}

const CommentSection = () => {
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [nameAndProperties, setNameAndProperties] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const textFieldRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const props = await checkLoginStatus();
            setNameAndProperties(props);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newCommentText.trim() && nameAndProperties) {
            const newComment = {
                id: comments.length + 1,
                user: nameAndProperties.userName,
                text: newCommentText,
                date: 'Hôm nay',
                avatarUrl: nameAndProperties.avatarUrl,
            };
            setComments([...comments, newComment]);
            setNewCommentText('');
            textFieldRef.current?.focus();
        }
    };

    const truncateUserName = (name, maxLength) =>
        name.length > maxLength ? name.substring(0, maxLength) + "..." : name;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!nameAndProperties) {
        return <div>Error: Không thể lấy thông tin người dùng.</div>;
    }

    return (
        <div className="bg-[#F8F5EC] rounded-lg shadow-md p-6 mt-4">
            <h2 className="text-lg font-semibold mb-3">Bình Luận</h2>

            <div className="mb-6">
                {comments.length === 0 ? (
                    <div className="text-gray-500 italic">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex items-start mb-4 p-3 bg-white rounded-md">
                            <Avatar src={comment.avatarUrl} alt="Avatar" sx={{ width: 32, height: 32, marginRight: '0.75rem' }} />
                            <div>
                                <div className="font-semibold text-black">
                                    <span className="mr-[5px] ml-1">
                                        {truncateUserName(comment.user, 15)}
                                    </span>
                                </div>
                                <div className="text-gray-700">{comment.text}</div>
                                <div className="text-gray-500 text-sm">
                                    {comment.date}
                                    <span className="ml-2 text-blue-500 cursor-pointer">Thích</span>
                                    <span className="ml-2 text-blue-500 cursor-pointer">Trả lời</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex items-center rounded-md" style={{ backgroundColor: '#F8F5EC' }}>
                <Avatar
                    src={nameAndProperties.avatarUrl}
                    alt="user photo"
                    sx={{ width: 32, height: 32, marginRight: '0.75rem' }}
                />
                <TextField
                    fullWidth
                    placeholder="Gửi bình luận"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    variant="outlined"
                    size="small"
                    inputRef={textFieldRef}
                    InputProps={{
                        style: { backgroundColor: 'white', borderRadius: '8px' },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton><ImageIcon sx={{ color: '#E2C696' }} /></IconButton>
                                <IconButton><CardGiftcardIcon sx={{ color: '#E2C696' }} /></IconButton>
                                <IconButton type="submit"><SendIcon sx={{ color: '#E2C696' }} /></IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </form>
        </div>
    );
};

export default CommentSection;
