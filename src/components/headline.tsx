import styles from "./headline.module.scss";

export const Headline = ({ text }: { text: string }) => (
  <div className={styles.text}>{text}</div>
);
