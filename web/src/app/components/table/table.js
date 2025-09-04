import React from 'react';

const TableComponent = ({ columns, rows, page, totalPages, setPage, renderActions }) => {
  return (
    <div className="pl-[16rem]">
      <div className="relative overflow-x-auto shadow-md rounded">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className={`px-4 py-2${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
              <th scope="col" className="px-4">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-2 max-w-96 ${col.className || ''}`} style={{ width: col.width }}>
                    {row[col.key]}
                  </td>
                ))}
                <td className="px-4 min-w-80">
                  {renderActions(row)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav className="flex items-center flex-column flex-wrap md:flex-row justify-center pt-4" aria-label="Table navigation">
          <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 mb-2">
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

export default TableComponent;
