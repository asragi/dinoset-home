import Image from "next/image";
import { Headline } from "./headline";
import styles from "./memberComponent.module.scss";
import { MemberCard } from "./memberCard";

export const MemberComponent = () => {
  return (
    <section id="member" className={styles.container}>
      <div className={styles.headlines}>
        <Headline text="メンバー" />
        <Headline text="Member" />
      </div>
      <div className={styles.products}>
        <MemberCard twitterId="mktksrg" instagramId="mktksrg"/>
        <MemberCard />
      </div>
    </section>
  );
};
