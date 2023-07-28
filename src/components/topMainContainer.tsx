import { TopCard } from './topCard';
import Image from 'next/image';
import styles from './topMainContainer.module.scss';

export const TopMainContainer = () => (
  <div className={styles.container}>
    <TopCard />
    {/* For tablet */}
    <Image className={styles.logo} height={300} width={300} alt={"Logo"} src="./logo.png"/>
  </div>
)