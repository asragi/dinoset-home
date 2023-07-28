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
          description={"ゲームデザイナー/エンジニア"}
          src={tmpIconSrc}
          twitterId="mktksrg"
          instagramId="mktksrg"
        />
        <MemberCard
          name={"如月まこと"}
          description={"ゲームデザイナー/エンジニア"}
          src={tmpIconSrc}
        />
      </div>
    </section>
  );
};
