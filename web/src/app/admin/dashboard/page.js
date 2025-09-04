"use client";
import styles from "@/app/ui/dashboard/dashboard.module.css";
import Total from "@/app/ui/dashboard/total/total";
import React, { useEffect, useState } from 'react';
import { fetchTotalItems } from '@/app/api/user';
import { fetchNewCustomerCount } from "@/app/api/user";
const Dashboard = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [newCustomerCount, setNewCustomerCount] = useState(0);
  useEffect(() => {
    fetchTotalItems()
        .then(totalItems => {
            setTotalCustomers(totalItems);
        })
        .catch(error => {
            console.error('There was an error fetching the customer data!', error);
        });
        fetchNewCustomerCount()
            .then(newCount => {
                setNewCustomerCount(newCount);
            })
            .catch(error => {
                console.error('There was an error fetching the new customer count!', error);
            });
}, []);

  return (
    <div className={styles.wrapper}>
    <div className={styles.main}>
      <div className={styles.cards}></div>
      <div>
        <div className={styles.totalContainer}>
          <Total
            title="Tổng số người dùng"
            numbers={totalCustomers}
            percentage=""
            h2=" hơn tháng vừa qua"
            avatar="https://cdn-icons-png.flaticon.com/512/476/476863.png"
          />
          <Total
            title="Tổng người dùng mới trong tháng qua"
            numbers={newCustomerCount}
            percentage=""
            h2=" hơn tháng vừa qua"
            avatar="https://cdn-icons-png.flaticon.com/512/476/476863.png"
          />
          <Total
            title="Tổng số truyện"
            numbers=""
            percentage=""
            h2=" hơn tháng vừa qua"
            avatar="https://cdn-icons-png.flaticon.com/512/3045/3045670.png"
          />
          <Total
            title="Tổng số lượt xem"
            numbers=""
            percentage=""
            h2=" hơn tháng vừa qua"
            avatar="https://cdn-icons-png.flaticon.com/512/3045/3045670.png"
          />
        </div>
      </div>
    </div>
  </div>
);
};

export default Dashboard;
