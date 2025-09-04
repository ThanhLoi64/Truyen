import { useEffect, useState } from "react";
import Link from "next/link";
import { MdManageAccounts, MdOutlinePassword } from "react-icons/md";
import { GrUserAdmin } from "react-icons/gr";
import { FaUser } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { IoLogOut } from "react-icons/io5";
import { checkLoginStatus } from "@/app/api/user";
import Cookies from "js-cookie";
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';

const DropDownProfile = ({ handleClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLoginStatus = async () => {
      await checkLoginStatus(setIsLoggedIn, setUserName, setRoles);
    };
    fetchLoginStatus();
  }, []);

  const userRoles = Cookies.get("roles") || "";
  const rolesArray = userRoles.split(",").map(role => role.trim());

  const handleLogout = async () => {
    try {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setIsLoggedIn(false);
      window.location.href = '/';
    } catch (error) {
      console.error("Error logging out:", error);
      
    }
  };

  const handleLinkClick = (href) => (event) => {
    event.preventDefault();
    setLoading(true);
    window.location.href = href;
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="flex flex-col gap-2">
          {loading && (
            <div className="flex justify-center items-center">
              <CircularProgress />
            </div>
          )}
          {!loading && (
            <>
              <MenuItem>
                <FaUser />
                <div className="text-black font-semibold ml-1">{userName}</div>
              </MenuItem>
              <Tooltip
                title={
                  <span style={{ fontSize: '16px' }}>
                    {roles.length > 0 ? roles.join(", ") : "No roles"}
                  </span>
                }
                arrow
              >
                <MenuItem>
                  <GrUserAdmin />
                  <div className="text-black font-semibold">

                    <span className="cursor-pointer ml-1">Vai trò</span>

                  </div>
                </MenuItem>
              </Tooltip>
              <MenuItem onClick={handleClose}>
                <MdOutlinePassword />
                <Link href="/changepassword" onClick={handleLinkClick("/changepassword")} className="text-black hover:opacity-75 ml-1">
                  Thay đổi mật khẩu
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ImProfile />
                <Link href="/user" onClick={handleLinkClick("/user")} className="text-black hover:opacity-75 ml-1">
                  Hồ sơ
                </Link>
              </MenuItem>
              {(rolesArray.includes("admin") || rolesArray.includes("sysadmin")) && (
                <MenuItem onClick={handleClose}>
                  <MdManageAccounts />
                  <Link href="/admin/dashboard" onClick={handleLinkClick("/admin/dashboard")} className="text-black hover:opacity-75 ml-1">
                    Quản lý
                  </Link>
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>
                <IoLogOut />
                <span className="text-black hover:opacity-75 ml-1">Đăng xuất</span>
              </MenuItem>
            </>
          )}
        </div>
      ) : null}
    </>
  );
};

export default DropDownProfile;
