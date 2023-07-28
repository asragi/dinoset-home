import Image from 'next/image';
import styles from './topSideContainer.module.scss';
import { TwitterButton } from './twitterButton';
import { InstagramButton } from './instagramButton';
import { ScrollLink } from './ScrollLink';

const logoSize = 160;

const snsIconSize = 34;
const snsId = "kyoryuteishoku";

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
        <InstagramButton id={snsId} src="/instagram.svg" size={snsIconSize} />
        <TwitterButton id={snsId} src="/twitter.svg" size={snsIconSize}/>
      </div>
      <div className={styles.options}>
        <ScrollLink to='product' text="お品書き" className={styles.option}/>
        <ScrollLink to='member' text="メンバー" className={styles.option}/>
        <ScrollLink to='contact' text="お問い合わせ" className={styles.option}/>
      </div>
    </div>
  </div>
);