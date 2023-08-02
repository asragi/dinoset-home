"use client"
import styles from "./topCard.module.scss";
import fadeStyles from "./fade.module.scss";
import Image from "next/image";
import { Link as Scroll } from "react-scroll";

export const TopCard = () => (
  <Scroll
    className={`${styles.card} ${fadeStyles.fadeUp}`}
    to="product"
    smooth
    offset={-100}
    >
    <div className={styles.text}>
      つなげて遊ぶカードゲーム『IGNITER』
      <br />
      2024年ゲームマーケット春のリリースに向けて
      <br />
      現在制作中！
    </div>
    <div className={styles.margin} />
    <div className={styles.thumbnail}>
      <Image
        src="./igniter-thumbnail.webp"
        width={300}
        height={300}
        alt="thumbnail" />
    </div>
  </Scroll>
);
