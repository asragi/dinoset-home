"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./commonSNSButton.module.scss";
import { MouseEventHandler } from "react";


type Props = {
  href: string;
  src: string;
  size: number;
  alt: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

const shrinkRate = 22 / 34;

export const CommonSNSButton = ({
  href,
  src,
  size,
  alt,
  className,
  onClick
}: Props) => {
  const iconWidth = size * shrinkRate;
  const iconHeight = size * shrinkRate;
  const style = {
    width: size,
    height: size
  };

  return (
    <Link
      href={href}
      className={`${styles.button} ${className}`}
      style={style}
      onClick={onClick}>
      <Image src={src} alt={alt} width={iconWidth} height={iconHeight}/>
    </Link>
  );
};
