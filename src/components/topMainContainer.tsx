"use client";
import { TopCard } from './topCard';
import { Link as Scroll } from "react-scroll";
import Image from 'next/image';
import styles from './topMainContainer.module.scss';

export const TopMainContainer = () => (
  <div className={styles.container}>
    <TopCard />
    {/* For tablet */}
    <Scroll to="product" smooth offset={-100} className={styles.logoContainer}>
        <Image className={styles.logo} height={300} width={300} alt={"Logo"} src="./logo.png"/>
    </Scroll>
  </div>
)