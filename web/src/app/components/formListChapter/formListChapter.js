import React from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const FormListChapter = ({ rows, page, limit, totalPages, setPage, handleDelete, handleHide, basePath }) => {
    const statusMapping = {
        0: { text: "Nháp", color: "gray" },
        1: { text: "Đang lên lịch", color: "rgb(203 138 5)" },
        2: { text: "Đã xuất bản", color: "rgb(25 191 86)" },
        3: { text: "Đã bị ẩn", color: "#ccc" }
    };

    const userRoles = Cookies.get("roles");
    const rolesArray = userRoles ? userRoles.split(",").map(role => role.trim()) : [];

    const handleEdit = (product) => {

        if (rolesArray.includes("admin") || rolesArray.includes("sysadmin")) {
            window.location.href = `${basePath}/dashboard/chapter/edit?postItemId=${product.id}`;
        } else if (product.status === 2 || product.status === 3) {
            return null;
        } else {
            window.location.href = `${basePath}/dashboard/chapter/edit?postItemId=${product.id}`;
        }
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-4 py-3">
                            STT
                        </th>
                        <th scope="col" className="px-6 py-3  text-center truncate">
                            Chương
                        </th>
                        <th scope="col" className="px-6 py-3 text-center truncate">
                            Ngày Thêm
                        </th>
                        <th scope="col" className="px-6 py-3 text-center truncate">
                            Ngày Xuất bản
                        </th>
                        <th scope="col" className="text-center px-6 py-3 truncate">
                            Nội dung
                        </th>
                        <th scope="col" className="text-center px-6 py-3 truncate">
                            Trạng thái
                        </th>
                        <th scope="col" className="px-6 py-3 text-center ">
                            Hành Động
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((product, index) => (
                        <tr
                            key={product.id}
                            className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}
                        >

                            <td className="w-4 p-5">
                                <div className="flex text-center">
                                    {(page - 1) * limit + index + 1}
                                </div>
                            </td>
                            <td
                                className={`px-6 py-4 truncate text-center max-w-24 ${product.isDelete ? "line-through" : ""}`}
                            >
                                {product.title}
                            </td>
                            <td className={`px-6 py-4 truncate text-center max-w-24 ${product.isDelete ? "line-through" : ""}`}>
                                {product.createdDate}
                            </td>
                            <td className={`px-6 py-4 truncate text-center max-w-24  text-green-500 ${product.isDelete ? "line-through" : ""}`}>
                                {product.publishDate}
                            </td>
                            <td className={`px-6 py-4 truncate text-center max-w-24 ${product.isDelete ? "line-through" : ""}`}>{product.body}</td>
                            <td className={`px-6 py-4 truncate text-center max-w-24 ${product.isDelete ? "line-through" : ""}`}>
                                <span style={{ color: statusMapping[product.status]?.color }}>
                                    {statusMapping[product.status]?.text}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                {product.isDelete ? (
                                    <>
                                        <Link
                                            href=""
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-6"
                                        >
                                            Khôi phục
                                        </Link>
                                    </>
                                ) : (
                                    <>

                                        <Link
                                            href=""
                                            onClick={() => handleEdit(product)}
                                            className={`font-medium text-blue-600 dark:text-blue-500 hover:underline mr-6 ${product.status === 2 || product.status === 3 && !(rolesArray.includes("admin") || rolesArray.includes("sysadmin")) ? 'text-[#ccc] cursor-not-allowed ' : ''}`}
                                        >
                                            Sửa
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="font-medium text-red-600 dark:text-red-500 hover:underline mr-6"
                                        >
                                            Xóa
                                        </button>
                                        <Link
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();

                                                if (product.status !== 2 && product.status !== 3) {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Chỉ ẩn khi chương đã xuất bản',
                                                    });
                                                } else {
                                                    Swal.fire({
                                                        title: `Bạn có chắc chắn muốn ${product.status === 3 ? 'bỏ ẩn' : 'ẩn'} chương này không?`,
                                                        icon: 'warning',
                                                        showCancelButton: true,
                                                        confirmButtonColor: '#3085d6',
                                                        cancelButtonColor: '#d33',
                                                        confirmButtonText: 'Có, tôi chắc chắn!',
                                                        cancelButtonText: 'Hủy bỏ'
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            handleHide(product.id, product.status);
                                                        }
                                                    });
                                                }
                                            }}
                                            className={` font-medium ${product.status === 3 ? 'text-yellow-600' : 'text-yellow-600'} dark:text-green-500 hover:underline mr-6`}
                                        >
                                            {product.status === 3 ? 'Bỏ ẩn' : 'Ẩn'}
                                        </Link>

                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <nav
                className="flex items-center flex-column flex-wrap md:flex-row justify-center mb-2 pt-4 "
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
                                        className={`flex items-center justify-center px-3 h-8 leading-tight border ${page === pageNum + 1
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
                                    Sau
                                </button>
                            </li>
                        </ul>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default FormListChapter;
