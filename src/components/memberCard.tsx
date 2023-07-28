import Image from "next/image";
import { InstagramButton } from "./instagramButton";
import styles from "./memberCard.module.scss";
import { TwitterButton } from "./twitterButton";

const iconSize = 96;

type Props = {
  src: string;
  name: string;
  description: string;
  twitterId?: string;
  instagramId?: string;
};

export const MemberCard = ({
  src,
  name,
  description,
  twitterId,
  instagramId,
}: Props) => (
  <div className={styles.container}>
    <Image
      className={styles.icon}
      src={src}
      width={iconSize}
      height={iconSize}
      alt={"Member Icon"}
    />
    <div className={styles.detail}>
      <div>
        <div className={styles.name}>{name}</div>
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.link}>
        {instagramId && (
          <InstagramButton
            id={instagramId}
            src="./instagram.svg"
            size={30}
            className={styles.snsMargin}
          />
        )}
        {twitterId && (
          <TwitterButton
            id={twitterId}
            src="./twitter.svg"
            size={30} 
            className={styles.snsMargin}/>
        )}
      </div>
    </div>
  </div>
);
