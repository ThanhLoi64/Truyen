import React from 'react';

const FilterDropdowns = ({
  categories = [], 
  selectedCategory,
  selectedStatus,
  selectedCompletion,
  handleCategoryChange,
  handleStatusChange,
  handleCompletionChange
}) => {
  return (
    <div className="flex space-x-1">
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-2.5"
      >
        <option value="">Tất cả thể loại</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      
      <select
        value={selectedStatus}
        onChange={handleStatusChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-2.5"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="1">Xuất bản</option>
        <option value="0">Lưu nháp</option>
      </select>
      
      <select
        value={selectedCompletion}
        onChange={handleCompletionChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-2.5"
      >
        <option value="">Tất cả tình trạng</option>
        <option value="completed">Đã hoàn thành</option>
        <option value="in-progress">Đang thực hiện</option>
      </select>
    </div>
  );
};

export default FilterDropdowns;
