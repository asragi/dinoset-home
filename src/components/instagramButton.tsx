import Image from "next/image";
import Link from "next/link";
import styles from "./instagramButton.module.scss";

interface Props {
  id: string,
  src: string,
  size: number
}

const instagramUrl = "https://instagram.com/";
const alt = "Instagram Button";
const shrinkRate = 22 / 34;
export const InstagramButton = ({ id, src, size }: Props) => {
  const iconWidth = size * shrinkRate;
  const iconHeight = size * shrinkRate;
  const style = {
    width: size,
    height: size
  };

  return (
    <Link
      href={instagramUrl.concat(id)} className={styles.instagram} style={style}>
      <Image src={src} alt={alt} width={iconWidth} height={iconHeight} />
    </Link>
  );
};
