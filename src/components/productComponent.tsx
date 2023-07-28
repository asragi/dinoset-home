import Image from "next/image";
import { Headline } from "./headline";
import styles from "./productComponent.module.scss";
import common from "./middleComponentCommon.module.scss";

export const ProductComponent = () => {
  return (
    <section id="product" className={common.container}>
      <div className={styles.headlines}>
        <Headline text="お品書き" />
        <Headline text="Product" />
      </div>
      <div className={styles.products}>
        <div className={styles.description}>
          つなげて遊ぶカードゲーム『Igniter』
          <br />
          2024年ゲームマーケット春のリリースに向けて
          <br />
          現在制作中！
        </div>
        <div className={styles.image}>
          <Image
            src="./igniter-thumbnail.webp"
            width={300}
            height={300}
            alt="thumbnail" />
        </div>
      </div>
    </section>
  );
};
