import { Headline } from "./headline";
import styles from "./contactComponent.module.scss";
import common from "./middleComponentCommon.module.scss";
import { ContactForm } from "./contact";

export const ContactComponent = () => {
  return (
    <section id="contact" className={common.container}>
      <div className={styles.headlines}>
        <Headline text="お問い合わせ" />
        <Headline text="Contact" />
      </div>
      <div className={styles.contact}>
        <ContactForm />
      </div>
    </section>
  );
};
