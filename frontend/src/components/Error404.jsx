import React from "react"

import styles from "../stylesheets/404.module.css"

const Error404 = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.svgdiv}></div>
        <div className={styles.text}>We're sorry , it looks like the page you're looking for isn't in our system. Head back <a href="/" className={styles.link}>home</a>!</div>
      </div>
    </div>
  )
}

export default Error404
