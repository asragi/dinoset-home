import { ScrollLink } from "./ScrollLink";
import { VerticalInlineSeparator } from "./VerticalInlineSeparator";
import styles from "./footerContainer.module.scss";

export const FooterContainer = () => (
  <div className={styles.container}>
    <div className={styles.sitemap}>
      <ScrollLink to='product' text="お品書き" />
      <VerticalInlineSeparator />
      <ScrollLink to='member' text="メンバー" />
      <VerticalInlineSeparator />
      <ScrollLink to='contact' text="お問い合わせ" />
    </div>
    <div className={styles.copyright}>Copyright©︎2023 恐竜定食</div>
  </div>
);
