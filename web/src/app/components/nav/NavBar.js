"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  AppBar, Toolbar, Avatar, Menu, Button, Box, Container,
  IconButton, Badge, Popover, Tabs, Tab, List, ListItem,
  ListItemAvatar, ListItemText, Typography
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Link from "next/link";
import DropDownProfile from "./DropDownProfile";
import { checkLoginStatus } from "@/app/api/user";
import { FaBookOpen } from "react-icons/fa";
import SearchBar from "./SearchBar";

const notifications = [
  { id: 1, name: 'Nado', content: 'đã đăng tải lên bộ truyện : Giá như em đừng đi', time: '2 phút trước', avatar: '/avatar1.jpg' },
  { id: 2, name: 'MCK', content: 'đã đăng tải lên bộ truyện : Phong cách', time: '5 phút trước', avatar: '/avatar2.jpg' },
  { id: 3, name: 'Wxride', content: 'đã đăng tải lên bộ truyện : Tình yêu không có lỗi', time: '15 phút trước', avatar: '/avatar3.jpg' },
  { id: 4, name: 'Tlinh', content: 'đã đăng tải lên bộ truyện : Lỡ yêu bạn thân', time: '20 phút trước', avatar: '/avatar4.jpg' },
  { id: 5, name: 'Viruss', content: 'đã đăng tải lên bộ truyện : Anh không thể cầm những cỏ gai thích anh', time: '30 phút trước', avatar: '/avatar5.jpg' },
  { id: 6, name: 'Pháo', content: 'đã đăng tải lên bộ truyện : Sự nghiệp chướng', time: '40 phút trước', avatar: '/avatar6.jpg' },
  { id: 7, name: 'J97', content: 'đã đăng tải lên bộ truyện : Tôi nhớ con...', time: '50 phút trước', avatar: '/avatar7.jpg' },
];

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverEl, setPopoverEl] = useState(null);
  const [tab, setTab] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [roles, setRoles] = useState([]);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [hidden, setHidden] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    checkLoginStatus(setIsLoggedIn, setUserName, setRoles);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setHidden(currentScrollTop > lastScrollTop);
      setLastScrollTop(Math.max(currentScrollTop, 0));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotificationOpen = (event) => setPopoverEl(event.currentTarget);
  const handleNotificationClose = () => setPopoverEl(null);

  const open = Boolean(popoverEl);
  const truncateUserName = (name, maxLength) => name.length > maxLength ? name.substring(0, maxLength) + "..." : name;

  return (
    <AppBar
      position="fixed"
      style={{
        background: "var(--bg)",
        boxShadow: "unset",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.1s ease",
        top: 0,
        width: "100%",
        zIndex: 1200,
      }}
    >
      <Container className="max-w-screen-xl">
        <Toolbar className="justify-between">
          <div className="flex items-center justify-between w-full">

            <div className="flex items-center text-5xl font-bold text-[#E2C696]">
              <FaBookOpen />
              <Link href="/" className="ml-4 text-4xl font-bold text-[#E2C696]">Bson Novel</Link>
            </div>
            <SearchBar />
            <IconButton onClick={handleNotificationOpen}>
              <NotificationsIcon sx={{ color: '#E2C696', width: 38, height: 38 }} />
            </IconButton>

            <Popover
              open={open}
              anchorEl={popoverEl}
              onClose={handleNotificationClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              PaperProps={{ sx: { width: 360, maxHeight: 500, overflowY: 'auto' } }}
            >
              <Tabs
                value={tab}
                onChange={(e, newVal) => setTab(newVal)}
                sx={{
                  borderBottom: '1px solid #ccc',
                  mb: 2,
                  minHeight: 'unset',
                  gap: 2,
                }}
                TabIndicatorProps={{ style: { display: 'none' } }}
              >
                <Tab
                  label="Tất cả"
                  sx={{
                    textTransform: 'none',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '500',
                    fontSize: '14px',
                    backgroundColor: tab === 0 ? '#E2C696' : 'transparent',
                    color: tab === 0 ? 'white' : 'black',
                    borderRadius: '4px',
                    width: '61px',
                    height: '22px',
                    minHeight: 'unset',
                    minWidth: 'unset',
                    lineHeight: '22px',
                    textAlign: 'center',
                    px: 0,
                    py: 0,
                    '&.Mui-selected': {
                      color: 'white',
                    },
                  }}
                />
                <Tab
                  label="Mới nhất"
                  sx={{
                    textTransform: 'none',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '500',
                    fontSize: '14px',
                    backgroundColor: tab === 1 ? '#E2C696' : 'transparent',
                    color: tab === 1 ? 'white' : 'black',
                    borderRadius: '4px',
                    width: '61px',
                    height: '22px',
                    minHeight: 'unset',
                    minWidth: 'unset',
                    lineHeight: '22px',
                    textAlign: 'center',
                    px: 0,
                    py: 0,
                    '&.Mui-selected': {
                      color: 'white',
                    },
                  }}
                />
              </Tabs>
              <List>
                {notifications.map((item) => (
                  <ListItem key={item.id} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={item.name} src={item.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="body2"><strong>{item.name}</strong> {item.content}</Typography>}
                      secondary={item.time}
                    />
                  </ListItem>
                ))}
              </List>
            </Popover>


            <div className="flex items-center">
              {isLoggedIn ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {roles.includes("user") || roles.includes("sysadmin") || roles.includes("admin") ? (
                    <Button variant="contained" href="/apanel/dashboard"
                      sx={{ mr: 2 }} style={{ backgroundColor: "var(--button)", color: "white" }}>
                      Panel
                    </Button>
                  ) : null}
                  <Avatar src="/img.jpg" alt="user photo" onClick={handleClick} sx={{ cursor: "pointer" }} />
                  <div className="text-black font-semibold ml-1">Xin chào, {truncateUserName(userName, 15)}!</div>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <DropDownProfile handleClose={handleMenuClose} />
                  </Menu>
                </Box>
              ) : (
                <>
                  <Button variant="outlined" href="/register" sx={{ mr: 2 }} style={{ color: "gray", borderColor: "gray" }}>Đăng ký</Button>
                  <Button variant="contained" href="/login" style={{ backgroundColor: "var(--button)", color: "white" }}>Đăng nhập</Button>
                </>
              )}
            </div>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
