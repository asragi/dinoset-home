'use client'
import Image from 'next/image';
import styles from './topSideContainer.module.scss';
import { TwitterButton } from './twitterButton';
import { Link as Scroll } from 'react-scroll';
import { InstagramButton } from './instagramButton';

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
        <Scroll to={'product'} smooth>お品書き</Scroll>
        <Scroll to={'member'}>メンバー</Scroll>
        <Scroll to={'contact'}>お問い合わせ</Scroll>
      </div>
    </div>
  </div>
);