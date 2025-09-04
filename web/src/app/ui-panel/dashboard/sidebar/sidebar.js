"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { AiFillHome } from 'react-icons/ai';
import { FaBook } from 'react-icons/fa';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className='fixed '>
      <aside id="default-sidebar" className="mt-2 top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-tr-xl border border-gray-100 shadow-md shadow-gray-400">
          <ul className="space-y-2 font-medium">
            <li>
              <h5 id="drawer-navigation-label" className="pb-4 text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Bảng điều khiển</h5>

            </li>
            <li>

              <Link href="/apanel/dashboard" className={` flex items-center p-2 rounded-[5px]   dark:text-white group ${pathname === '/apanel/dashboard' ? 'bg-[var(--button)] text-white' : 'text-gray-900 dark:hover:bg-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white'}`}>
              <AiFillHome />
                <span className="ms-3">Trang chủ</span>
              </Link>
            </li>

            <li>
              <Link href="/apanel/dashboard/listbook" className={`flex items-center p-2  rounded-[5px]   dark:text-white group ${pathname === '/apanel/dashboard/listbook' ? 'bg-[var(--button)] text-white' : 'text-gray-900 dark:hover:bg-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white'}`}>
              <FaBook />
                <span className="flex-1 ms-3 whitespace-nowrap">Danh sách truyện</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
