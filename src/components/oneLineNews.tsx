import styles from "./oneLineNews.module.scss";

export const OneLineNews = () => (
  <div className={styles.container}>
    <span className={styles.news}>News</span>
    <span className={styles.date}>2023/08/02</span>
    <span>『恐竜定食』公式Webサイトオープン！</span>
  </div>
);
