'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserSeriesList, deleteSeriesUser } from '@/app/api/user';
import FilterDropdowns from '../../../components/dropdown/page';

const DataGridDemo = () => {
  const [allData, setAllData] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCompletion, setSelectedCompletion] = useState("");

  const formatDate = (dateString) => {
    const datePart = dateString.split("T")[0];
    return `${datePart}`;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const allData = [];
      let currentPage = 1;
      let data;
      do {
        data = await UserSeriesList(currentPage);
        if (data && data.items) {
          allData.push(...data.items);
        }
        currentPage++;
      } while (data && data.items && data.items.length > 0);

      setAllData(allData);
      filterAndPaginateData(allData, 1);
      const categoriesSet = new Set(allData.map(item => item.categoryName));
      setCategories([...categoriesSet]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginateData = (data, currentPage = page) => {
    const filteredItems = data.filter(item =>
      (!selectedCategory || item.categoryName === selectedCategory) &&
      (selectedStatus === "" || item.status.toString() === selectedStatus) &&
      (selectedCompletion === "" || (selectedCompletion === "completed" ? item.isCompleted === true : item.isCompleted === null))
    );

    setTotalPages(Math.ceil(filteredItems.length / 10));
    const paginatedData = filteredItems.slice((currentPage - 1) * 10, currentPage * 10);
    setRows(paginatedData.map((item) => ({
      id: item.id,
      name: item.name || "",
      title: item.title || "",
      author: item.author || "",
      category: item.categoryName || "",
      summary: item.summary || "",
      createdDate: formatDate(item.createdDate),
      status: item.status,
      isCompleted: item.isCompleted,
      thumbnailImgUrl: item.thumbnailImg ? item.thumbnailImg.url : "",
      thumbnailImgMiniUrl: item.thumbnailImg ? item.thumbnailImg.miniUrl : "",
    })));
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    filterAndPaginateData(allData, 1);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    filterAndPaginateData(allData, 1);
    setPage(1);
  };

  const handleCompletionChange = (event) => {
    setSelectedCompletion(event.target.value);
    filterAndPaginateData(allData, 1);
    setPage(1);
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Bạn chắc chắn muốn xóa Truyện này?");
      if (!confirmDelete) {
        return;
      }
      await deleteSeriesUser(id);
      fetchData();
    } catch (error) {
      console.error("Lỗi xóa Truyện:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndPaginateData(allData, page);
  }, [page, selectedCategory, selectedStatus, selectedCompletion]);

  return (
    <div className="pl-[16rem]">
      <div className="flex justify-between items-center py-1">
      <FilterDropdowns
        categories={categories}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        selectedCompletion={selectedCompletion}
        handleCategoryChange={handleCategoryChange}
        handleStatusChange={handleStatusChange}
        handleCompletionChange={handleCompletionChange}
      />
        <Link
          href="/apanel/dashboard/listbook/add"
          className="hidden lg:inline-block lg:ml-auto lg:mr-3 my-2 px-6 py-2 bg-[var(--button)] hover:bg-[var(--buttonSoft)] text-sm text-gray-900 font-bold rounded transition duration-200 border border-gray-300 dark:border-gray-600"
        >
          <button>Thêm Truyện</button>
        </Link>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-2 text-center">STT</th>
              <th scope="col" className="px-2 py-1 truncate">Thumbnail</th>
              <th scope="col" className="px-2 py-1 truncate">Tên</th>
              <th scope="col" className="px-2 py-1 truncate">Thể loại</th>
              <th scope="col" className="px-2 py-1 truncate">Tác giả</th>
              <th scope="col" className="px-2 py-1 truncate">Tóm tắt</th>
              <th scope="col" className="px-2 py-1 truncate text-center">Ngày tạo</th>
              <th scope="col" className="px-2 py-1 truncate text-center">Trạng thái</th>
              <th scope="col" className="px-2 py-1 truncate text-center">Tình trạng</th>
              <th scope="col" className="px-2 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product, index) => (
              <tr
                key={product.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="w-4 p-2">
                  <div className="flex items-center">
                    {(page - 1) * 10 + index + 1}
                  </div>
                </td>
                <td className="flex items-center">
                  <img
                    src={product.thumbnailImgUrl}
                    alt={product.name}
                    className="w-12 h-12 object-cover ml-4"
                  />
                </td>
                <td className="max-w-32 px-2 font-medium text-gray-900 whitespace-nowrap dark:text-white truncate">
                  {product.title}
                </td>
                <td className="px-2 truncate max-w-32">{product.category}</td>
                <td className="px-2 truncate max-w-32">
                  {product.author || "Không có tác giả"}
                </td>
                <td className="px-2 truncate max-w-32">{product.summary}</td>
                <td className="px-2 truncate w-24">{product.createdDate}</td>
                <td className="px-2 truncate w-24 text-center">
                  {product.status === 1 ? (
                    <span className="text-green-600 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-1"></span>
                      Xuất Bản
                    </span>
                  ) : (
                    <span className="text-gray-600 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-gray-600 mr-1"></span>
                      Lưu nháp
                    </span>
                  )}
                </td>
                <td className="px-2 truncate w-24 text-center">
                  {product.isCompleted === true ? (
                    <span className="text-green-600 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-1"></span>
                      Đã hoàn thành
                    </span>
                  ) : (
                    <span className="text-yellow-600 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-yellow-600 mr-1"></span>
                      Đang thực hiện
                    </span>
                  )}
                </td>
                <td className="px-2 text-center">
                  <Link
                    href={`/apanel/dashboard/listbook/edit?postId=${product.id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                  >
                    Sửa
                  </Link>
                  <Link
                    href=""
                    onClick={() => handleDelete(product.id)}
                    variant="text"
                    className="font-medium text-red-600 dark:text-red-500 hover:underline mr-4"
                  >
                    Xóa
                  </Link>
                  <Link
                    href={`/apanel/dashboard/chapter/add?postId=${product.id}`}
                    className="font-medium text-green-600 dark:text-green-500 hover:underline"
                  >
                    Thêm Chương
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav
          className="flex items-center flex-column flex-wrap md:flex-row justify-center mb-1 pt-4"
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
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => setPage(index + 1)}
                      className={`flex items-center justify-center px-3 h-8 leading-tight border ${page === index + 1
                          ? "text-blue-600 bg-blue-50 border-blue-300 hover:bg-blue-100 hover:text-blue-700"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        }`}
                    >
                      {index + 1}
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
    </div>
  );
};

export default DataGridDemo;
