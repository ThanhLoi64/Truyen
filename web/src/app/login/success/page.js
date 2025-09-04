'use client';
import React, { useState, useEffect } from "react";
import { loginSocialUser } from "../../api/user";

const UserLoginSuccessPage = () => {
    

    // Fetch user information when the component is mounted
    useEffect(() => {
        const fetchLoginStatus = async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const postItemIdFromURL = searchParams.get("postItemId");
            if(searchParams.has("returnUrl")){
              let response = await loginSocialUser();
            }
            //await checkLoginStatus(setIsLoggedIn, setUserName, setRoles);
          };
          fetchLoginStatus();
    }, []);

    return (
        <section className="bg-gray-100">
            
        </section>
    );
};

export default UserLoginSuccessPage;
