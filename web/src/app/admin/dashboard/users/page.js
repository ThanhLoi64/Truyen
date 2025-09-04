"use client";
import React, { useEffect, useState } from "react";
import {
  fetchUserList,
  deleteUser,
  searchUserByPhoneNumber,
  searchUserByName,
  searchUserByRole,
  putBannedUser,
  putUnBannedUser,
} from "@/app/api/user";
import Cookies from "js-cookie";
import Link from "next/link";
import EditUserPage from "./edit/page";

const DataGridDemo = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const limit = 10;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [role, setRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log(
        "Fetching data with search query:",
        searchQuery,
        "role:",
        selectedRole,
        "and page:",
        page
      );
      const response = searchQuery
        ? isNaN(searchQuery)
          ? await searchUserByName(searchQuery)
          : await searchUserByPhoneNumber(searchQuery)
        : selectedRole
          ? await searchUserByRole(selectedRole)
          : await fetchUserList(page);

      console.log("API response:", response);

      if (response && Array.isArray(response.items)) {
        const pageSize = 10;
        const transformedData = response.items.map((user, index) => ({
          id: user.id,
          stt: (page - 1) * pageSize + index + 1,
          userName: user.userName || "user",
          firstName: user.firstName || "N/A",
          lastName: user.lastName || "",
          phoneNumber: user.phoneNumber || "N/A",
          email: user.email,
          isOnline: user.isOnline,
          role: user.roles.map((role) => role.title).join(", "),
          isLockOut: user.isLockOut,
        }));
        setRows(transformedData);
        setTotalPages(response.totalPages);
      } else {
        console.error("Unexpected data format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, searchQuery, selectedRole]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setPage(1);
    setDropdownVisible(false);
  };

  const handleDelete = async (id) => {
    try {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        console.error("Access token not found.");
        return;
      }
      const confirmDelete = window.confirm(
        "Bạn chắc chắn muốn xóa người dùng này?"
      );
      if (!confirmDelete) {
        return;
      }
      console.log(`Đang xóa người dùng với ID: ${id}`);
      await deleteUser(id);
      console.log("Người dùng đã được xóa thành công.");
      fetchData();
    } catch (error) {
      console.error("Lỗi xóa người dùng:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEdit = (user) => {
    console.log("Editing User: ", user);
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleBan = async (id) => {
    try {
      console.log(`Đang cấm người dùng với ID: ${id}`);
      const response = await putBannedUser(id);
      console.log("Người dùng đã bị cấm:", response);
      setRows((prevRows) =>
        prevRows.map((user) =>
          user.id === id ? { ...user, isLockOut: true } : user
        )
      );

      window.alert("Người dùng đã được cấm thành công!");
    } catch (error) {
      console.error("Lỗi khi cấm người dùng:", error);
      window.alert("Không thể cấm người dùng này!", error);
    }
  };

  const handleUnBan = async (id) => {
    try {
      console.log(`Đang gỡ cấm người dùng với ID: ${id}`);
      const response = await putUnBannedUser(id);
      console.log("đã gỡ cấm người dùng", response);
      setRows((prevRows) =>
        prevRows.map((user) =>
          user.id === id ? { ...user, isLockOut: false } : user
        )
      );

      window.alert("Người dùng đã được gỡ cấm thành công!");
    } catch (error) {
      console.error("Lỗi khi gỡ cấm người dùng:", error);
      window.alert("Không thể gỡ cấm người dùng này!", error);
    }
  };
  return (
    <div className="pl-[16rem]">
      {editingUser ? (
        <EditUserPage
          user={editingUser}
          onCancel={handleCancelEdit}
          onSave={fetchData}
        />
      ) : (
        <>
          <div className="flex justify-between items-center py-1">
            <div className="rounded">
              <form className="max-w-lg mx-auto rounded">
                <div className="flex relative">
                  <label
                    htmlFor="search-dropdown"
                    className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white "
                  >
                    Your Email
                  </label>
                  <button
                    id="dropdown-button"
                    className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                    type="button"
                    onClick={toggleDropdown}
                  >
                    Chọn quyền{" "}
                    <svg
                      className="w-2.5 h-2.5 ms-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                  {isDropdownVisible && (
                    <div
                      id="roles"
                      className="absolute left-0 top-full mt-2 z-10 bg-white divide-y divide-gray-100 shadow w-44 dark:bg-gray-700"
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdown-button"
                      >
                        <li>
                          <button
                            type="button"
                            value="admin"
                            className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => handleRoleSelect("")}
                          >
                            Tất cả
                          </button>
                          <button
                            type="button"
                            value="admin"
                            className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => handleRoleSelect("admin")}
                          >
                            Admin
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            value="staff"
                            className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => handleRoleSelect("staff")}
                          >
                            Staff
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            value="customer"
                            className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => handleRoleSelect("customer")}
                          >
                            Customer
                          </button>
                          <button
                            type="button"
                            value="user"
                            className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => handleRoleSelect("user")}
                          >
                            User
                          </button>
                        </li>
                        <li>
                          <button
                            type="guest"
                            onClick={() => handleRoleSelect("guest")}
                            className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Guest
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                  <div className="relative w-full rounded">
                    <input
                      type="search"
                      id="search-dropdown"
                      className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      required
                    />
                    <button
                      type="submit"
                      className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-[var(--button)] rounded border border-[var(--button)] hover:bg-[var(--buttonSoft)] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-[var(--button)] dark:hover:bg-[var(--button)] dark:focus:ring-[var(--button)]"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                      <span className="sr-only">Search</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <Link
              href="/admin/dashboard/users/add"
              className="hidden lg:inline-block lg:ml-auto lg:mr-3 my-2 px-6 py-3 bg-[var(--button)] hover:bg-[var(--buttonSoft)] text-sm text-gray-900 font-bold rounded transition duration-200 border border-gray-300 dark:border-gray-600"
            >
              Thêm người dùng
            </Link>
          </div>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    STT
                  </th>
                  <th scope="col" className="px-6 py-3 truncate">
                    Tên người dùng
                  </th>
                  <th scope="col" className="px-6 py-3 truncate">
                    Họ và tên
                  </th>
                  <th scope="col" className="px-6 py-3 truncate">
                    SĐT
                  </th>
                  <th scope="col" className="px-6 py-3 truncate">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 truncate">
                    Quyền
                  </th>
                  <th scope="col" className="px-4 py-3 truncate text-center">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((user, index) => (
                  <tr
                    key={user.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="w-4 p-2">
                      <div className="flex items-center">
                        {(page - 1) * limit + index + 1}
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white truncate"
                    >
                      {user.userName}
                    </th>
                    <td className="px-6 py-3 truncate max-w-32">
                      {user.firstName + " " + user.lastName}
                    </td>
                    <td className="px-6 py-3 truncate max-w-32">
                      {user.phoneNumber}
                    </td>
                    <td className="px-6 py-3 truncate max-w-32">
                      {user.email}
                    </td>
                    <td className="px-6 py-3 truncatemax-max-w-32">
                      {Array.isArray(user.role) ? (
                        <div>{user.role.join(", ")}</div>
                      ) : typeof user.role === "string" ? (
                        <div>{user.role}</div>
                      ) : (
                        <div>Không có quyền</div>
                      )}
                    </td>
                    <td className="px-6 truncate w-24 text-center">
                      {user.isOnline ? (
                        <span className="text-green-600 flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-1"></span>
                          Online
                        </span>
                      ) : (
                        <span className="text-gray-400 flex items-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
                          Offline
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-3">
                      <button
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-6"
                        onClick={() => handleEdit(user)}
                      >
                        Sửa
                      </button>

                      <Link
                        href=""
                        onClick={() => handleDelete(user.id)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline mr-6"
                      >
                        Xóa
                      </Link>
                      {user.isLockOut ? (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Có muốn hủy cấm người dùng này không?"
                              )
                            ) {
                              handleUnBan(user.id);
                            }
                          }}
                          className="font-medium text-green-600 dark:text-green-500 hover:underline mr-6"
                        >
                          Hủy cấm
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Có muốn cấm người dùng này không?"
                              )
                            ) {
                              handleBan(user.id);
                            }
                          }}
                          className="font-medium text-orange-600 dark:text-orange-500 hover:underline mr-6"
                        >
                          Cấm
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <nav
              className="flex items-center flex-column flex-wrap md:flex-row justify-center pt-4 pb-1"
              aria-label="Table navigation"
            >
              <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                {totalPages > 1 && (
                  <ul className="inline-flex">
                    <li>
                      <button
                        onClick={() => setPage((prevPage) => prevPage - 1)}
                        disabled={page <= 1}
                        className="flex items-center justify-center px-3 h-8 ms-0 rounded-l leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        Trước
                      </button>
                    </li>
                    {[...Array(totalPages).keys()].map((pageNum) => (
                      <li key={pageNum}>
                        <button
                          onClick={() => setPage(pageNum + 1)}
                          className={`flex items-center justify-center px-3 h-8 leading-tight border ${
                            page === pageNum + 1
                              ? "text-blue-600 bg-blue-50 border-blue-300 hover:bg-blue-100 hover:text-blue-700"
                              : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                          } dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                        >
                          {pageNum + 1}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={() => setPage((prevPage) => prevPage + 1)}
                        disabled={page >= totalPages}
                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        Kế tiếp
                      </button>
                    </li>
                  </ul>
                )}
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default DataGridDemo;
