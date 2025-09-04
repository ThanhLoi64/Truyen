import React from 'react';
import styles from "@/app/ui-panel/dashboard/dashboard.module.css"
import Sidebar from '@/app/ui-panel/dashboard/sidebar/sidebar';
const layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar/>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}

export default layout;