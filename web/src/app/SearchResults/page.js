"use client";
import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '../components/nav/Footer';
import { Skeleton, Container, Pagination, Stack } from '@mui/material';
import { FiEye } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const SearchResultsContent = () => {
  const [results, setResults] = React.useState([]);
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(12);
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const searchResults = localStorage.getItem('searchResults');
    const keyword = localStorage.getItem('searchKeyword');
    let savedPage = searchParams.get('Page') || localStorage.getItem('currentPage');

    if (!savedPage || isNaN(savedPage) || parseInt(savedPage, 10) < 1) {
      savedPage = 1;
    }

    if (searchResults) {
      const parsedResults = JSON.parse(searchResults);
      setResults(parsedResults);
    }

    if (keyword) {
      setSearchKeyword(keyword);
    } else {
      setSearchKeyword('');
    }

    setPage(parseInt(savedPage, 10));

    if (keyword) {
      router.push(
        `/SearchResults?keyword=${encodeURIComponent(keyword)}&Page=${savedPage}`,
        undefined,
        { shallow: true }
      );
    }

    setLoading(false);

    localStorage.setItem('currentPage', savedPage);
  }, [searchParams, router]);

  const fetchSearchResults = async () => {
    const response = await fetch(
      `/api/search?keyword=${encodeURIComponent(searchKeyword)}&Page=${page}`
    );
    const data = await response.json();
    setResults(data.results);
    localStorage.setItem('searchResults', JSON.stringify(data.results));
  };

  React.useEffect(() => {
    if (searchKeyword) {
      fetchSearchResults();
    }
  }, [searchKeyword, page]);

  const handleItemClick = (hashId) => {
    router.push(`/Novel/SingleSeriesPage?hashId=${hashId}`);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    localStorage.setItem('currentPage', newPage);
    router.push(
      `/SearchResults?keyword=${encodeURIComponent(searchKeyword)}&Page=${newPage}`,
      undefined,
      { shallow: true }
    );
  };

  const truncateString = (str, maxLength) => {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
  };

  const paginatedResults = results.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow mt-10">
        <Container>
          <h1 className="text-2xl font-semibold mb-6 text-left">
            Tìm kiếm với từ khóa:{' '}
            <span className="text-[#000]">"{searchKeyword}"</span>
          </h1>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                  <Skeleton variant="rectangular" width="100%" height={200} />
                  <div className="mt-4">
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {paginatedResults.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-[10px] shadow-md p-4 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                    onClick={() => handleItemClick(item.hashId)}
                  >
                    {item.thumbnailImg?.url ? (
                      <img
                        src={item.thumbnailImg.url}
                        alt={item.title}
                        className="w-full h-80 object-cover rounded-[5px] mb-4 shadow-md shadow-slate-600 border"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                        <span className="text-gray-500">Ảnh không có sẵn</span>
                      </div>
                    )}
                    <div className="flex mb-1 justify-end">
                      <span className="flex italic text-sm font-thin gap-5">
                        <h1 className="flex flex-shrink-0 items-center gap-1 text-sm">
                          <FiEye /> {item.view}
                        </h1>
                        <h1 className="flex flex-shrink-0 items-center gap-1 text-sm">
                          <FaHeart className="text-red-600" /> {item.voteCount}
                        </h1>
                      </span>
                    </div>
                    <hr className="bg-gray-200 mb-1"></hr>
                    <h2 className="text-lg font-semibold mb-2">
                      {truncateString(item.title, 17)}
                    </h2>

                    <div className="flex mb-1">
                      <span className="font-bold">Tác giả:</span>
                      <span className="ml-2 text-gray-700">{item.author}</span>
                    </div>
                    <div className="flex mb-1">
                      <span className="font-bold">Thể loại:</span>
                      <span className="ml-2 text-gray-700">
                        {item.categoryName}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold">Trạng thái:</span>
                      <span
                        className={`ml-2 text-sm ${item.isCompleted ? 'text-green-500' : 'text-yellow-500'}`}
                      >
                        {item.isCompleted ? 'Hoàn thành' : 'Đang ra'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Stack spacing={2} className="mt-6" alignItems="center">
                <Pagination
                  count={Math.ceil(results.length / rowsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      bgcolor: '#E2C696',
                      color: '#fff',
                      '&:hover': {
                        bgcolor: '#d1b888',
                      },
                    },
                    '& .Mui-selected': {
                      bgcolor: '#d1b888 !important',
                      color: '#fff',
                    },
                  }}
                />
              </Stack>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-6">
              Không có truyện bạn đang tìm kiếm
            </p>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
};

const SearchResults = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SearchResultsContent />
  </Suspense>
);

export default SearchResults;
