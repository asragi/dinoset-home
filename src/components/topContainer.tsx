import { TopMainContainer } from "./topMainContainer";
import { TopSideContainer } from "./topSideContainer";
import styles from './topContainer.module.scss';

export const TopContainer = () => (
  <div className={styles.container}>
    <TopSideContainer />
    <TopMainContainer />
  </div>
);