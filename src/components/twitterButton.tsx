import styles from "./twitterButton.module.scss";
import { CommonSNSButton } from "./commonSNSButton";

interface Props {
  id: string,
  src: string,
  size: number,
  className?: string,
}

const twitterUrl = "https://twitter.com/";
const alt = "Twitter Button";

export const TwitterButton = ({id, src, size, className}: Props) => {
  const href = twitterUrl.concat(id);
  const newClassName = `${className} ${styles.twitter}`;
  const props = {
    href,
    src,
    size,
    alt,
    className: newClassName
  };
  return <CommonSNSButton {...props}/>
}
