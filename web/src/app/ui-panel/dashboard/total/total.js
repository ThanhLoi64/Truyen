import React from 'react';
import styles from "./total.module.css";

const Total = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.text}>
        <h2 className={styles.title}>{props.title || "--"}</h2>
        <h1 className={styles.number}>{props.numbers || "--"}</h1>
        <h2>
          <span className={styles.percentage}>{props.percentage || "--"}</span>
          {props.h2 || "--"}
        </h2>
      </div>
      <div className={styles.img} >
        <img src={props.avatar} alt="Descriptin" />
      </div>
    </div>

  );
};

export default Total;
