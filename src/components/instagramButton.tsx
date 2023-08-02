import styles from "./instagramButton.module.scss";
import { CommonSNSButton } from "./commonSNSButton";

interface Props {
  id: string,
  src: string,
  size: number,
  className?: string,
}

const instagramUrl = "https://instagram.com/";
const alt = "Instagram Button";
const shrinkRate = 22 / 34;

export const InstagramButton = ({id, src, size, className}: Props) => {
  const href = instagramUrl.concat(id);
  const newClassName = `${styles.instagram} ${className}`;
  const props = {
    href,
    src,
    size,
    alt,
    className: newClassName
  };
  return <CommonSNSButton {...props}/>
};
