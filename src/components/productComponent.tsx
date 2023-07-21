import { Headline } from "./headline";
import styles from "./productComponent.module.scss";

export const ProductComponent = () => {
  return (
    <div className={styles.container}>
      <div className={styles.headlines}>
        <Headline text="お品書き"/>
        <Headline text="Product"/>
      </div>
      <div className={styles.products}>
        <div className={styles.description}>
          つなげて遊ぶカードゲーム『Igniter』
          <br/>
          2024年ゲームマーケット春のリリースに向けて
          <br/>
          現在制作中！
        </div>
        <div className={styles.image}>商品画像</div>
      </div>
    </div>
  );
};
