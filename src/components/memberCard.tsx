import Image from "next/image";
import { InstagramButton } from "./instagramButton";
import styles from "./memberCard.module.scss";
import { TwitterButton } from "./twitterButton";
import rotate from "./rotation.module.scss";
import { MailButton } from "./mailButton";

const iconSize = 96;

type Props = {
  src: string;
  name: string;
  description: string;
  twitterId?: string;
  instagramId?: string;
  eMail?: string;
};

export const MemberCard = ({
  src,
  name,
  description,
  twitterId,
  instagramId,
  eMail
}: Props) => (
  <div className={styles.container}>
    <Image
      className={`${styles.icon} ${rotate.rotateOnHover}`}
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
        {eMail && (
          <MailButton
            eMail={eMail}
            size={30}
            className={styles.snsMargin}
          />
        )}
      </div>
    </div>
  </div>
);
