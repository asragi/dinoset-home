import Image from "next/image";
import Link from "next/link";
import styles from "./twitterButton.module.scss";

interface Props {
  id: string,
  src: string,
  size: number
}

const twitterUrl = "https://twitter.com/";
const alt = "Twitter Button";
const shrinkRate = 22/34;
export const TwitterButton = ({ id, src, size }: Props) => { 
  const iconWidth = size * shrinkRate;
  const iconHeight = size * shrinkRate;
  const style = {
    width: size,
    height: size
  };

  return (
    <Link
    href={twitterUrl.concat(id)} className={styles.twitter} style={style}>
      <Image src={src} alt={alt} width={iconWidth} height={iconHeight}/>
    </Link>
  );
};
