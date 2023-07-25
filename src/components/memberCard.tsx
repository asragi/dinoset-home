import { InstagramButton } from "./instagramButton";
import styles from "./memberCard.module.scss";
import { TwitterButton } from "./twitterButton";

type Props = {
  twitterId?: string;
  instagramId?: string;
};

export const MemberCard = (
  { twitterId, instagramId }: Props
) => (
  <div className={styles.container}>
    <div className={styles.icon}>Icon</div>
    <div className={styles.detail}>
      <div className={styles.description}>description</div>
      <div className={styles.link}>
        {instagramId && <InstagramButton id={instagramId} src="./instagram.svg" size={30} className={styles.snsMargin}/>}
        {twitterId && <TwitterButton id={twitterId} src="./twitter.svg" size={30} />}
      </div>
    </div>
  </div>
);
