import styles from "./topCard.module.scss";

export const TopCard = () => (
  <div className={styles.card}>
    <div className={styles.text}>
      つなげて遊ぶカードゲーム『Igniter』
      <br />
      2024年ゲームマーケット春のリリースに向けて
      <br />
      現在制作中！
    </div>
    <div className={styles.margin}/>
    <div className={styles.thumbnail}>Image</div>
  </div>
);
