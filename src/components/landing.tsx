import { FooterContainer } from "./footerContainer";
import { MiddleContainer } from "./middleContainer";
import { TopContainer } from "./topContainer";
import styles from "./landing.module.scss";

export const Landing = () => (
  <div className={styles.background}>
    <div className={styles.main}>
      <TopContainer />
      <MiddleContainer />
      <FooterContainer />
    </div>

  </div>
);
