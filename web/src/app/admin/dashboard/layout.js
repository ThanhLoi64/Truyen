import React from 'react';
import styles from "@/app/ui/dashboard/dashboard.module.css"
import Sidebar from '@/app/ui/dashboard/sidebar/sidebar';
import Navbar from '@/app/components/nav/NavBar';
const layout = ({ children }) => {
  return (
    <div>
      <div className={styles.menu}>
        <Navbar />
          <div className='flex'>
            <div>
              <Sidebar />
            </div>
            <div className={styles.content}>
              {children}
            </div>
          </div>

      </div>
    </div>
  )
}

export default layout;