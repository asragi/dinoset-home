"use client"
import { ContactFormPresenter, ContactFormPresenterOut } from "./contactFormPresenter";
import styles from "./contactForm.module.scss";

const ContactFormView = ({
  name,
  onChangeName,
  eMail,
  onChangeEMail,
  text,
  onChangeText,
  onSubmit,
}: ContactFormPresenterOut) => (
  <form onSubmit={onSubmit} className={styles.form}>
    <label htmlFor="name">お名前</label>
    <input
      id="name"
      value={name}
      onChange={onChangeName}>
    </input>
    <label htmlFor="email">e-mail</label>
    <input
      id="email"
      inputMode="email"
      value={eMail}
      onChange={onChangeEMail}>
    </input>
    <label htmlFor="text">本文</label>
    <textarea
      className={styles.textArea}
      id="text"
      inputMode="text"
      value={text}
      onChange={onChangeText}
      rows={20}
      required>
    </textarea>
    <input className={styles.submit} type="submit" value="submit"/>
  </form>
);

export const ContactForm = () => ContactFormView(ContactFormPresenter());
