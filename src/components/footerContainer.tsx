import { VerticalInlineSeparator } from "./VerticalInlineSeparator";
import styles from "./footerContainer.module.scss";

export const FooterContainer = () => (
  <div className={styles.container}>
    <div className={styles.sitemap}>
      <div>お品書き</div>
      <VerticalInlineSeparator />
      <div>メンバー</div>
      <VerticalInlineSeparator />
      <div>お問合せ</div>
    </div>
    <div className={styles.copyright}>Copyright©︎2023 恐竜定食</div>
  </div>
);
