import Image from 'next/image';
import styles from './topSideContainer.module.scss';
import { TwitterButton } from './twitterButton';
import Link from 'next/link';

const logoSize = 160;
export const TopSideContainer = () => (
  <div className={styles.container}>
    <div className={styles.menu}>
      <Image
        src="/logo.png"
        alt="Vercel Logo"
        className={styles.vercelLogo}
        width={logoSize}
        height={logoSize}
        priority
      />
      <div>恐竜定食</div>
      <div className={styles.sns}>
        <TwitterButton />
      </div>
      <div className={styles.options}>
        <Link href="#">お品書き</Link>
        <Link href="#">メンバー</Link>
        <Link href="#">お問い合わせ</Link>
      </div>
    </div>
  </div>
);