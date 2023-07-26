import { Headline } from "./headline";
import styles from "./contactComponent.module.scss";
import { ContactForm } from "./contact";

export const ContactComponent = () => {
  return (
    <section id="contact" className={styles.container}>
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
