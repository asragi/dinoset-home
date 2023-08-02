import { Headline } from "./headline";
import styles from "./memberComponent.module.scss";
import common from "./middleComponentCommon.module.scss";
import { MemberCard } from "./memberCard";

const tmpIconSrc = "/logo.png";

export const MemberComponent = () => {
  return (
    <section id="member" className={common.container}>
      <div className={styles.headlines}>
        <Headline text="メンバー" />
        <Headline text="Member" />
      </div>
      <div className={styles.products}>
        <MemberCard
          name={"如月まこと"}
          description={"ゲームデザイナー"}
          src={"/icon/ksrgmkt.png"}
          twitterId="mktksrg"
        />
        <MemberCard
          name={"euraru"}
          description={"イラストレーター"}
          src={"/icon/euraru.png"}
          twitterId="euraru"
          instagramId="euraru_insta"
          eMail="info&&euraru.net"
        />
      </div>
    </section>
  );
};
