import Image from 'next/image';
import styles from './topSideContainer.module.scss';

const logoSize = 160;
export const TopSideContainer = () => (
  <div className={styles.container}>
    side
    <Image
      src="/logo.png"
      alt="Vercel Logo"
      className={styles.vercelLogo}
      width={logoSize}
      height={logoSize}
      priority
    />
  </div>
);