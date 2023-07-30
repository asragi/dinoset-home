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
  nameError,
  eMailError,
  textError,
}: ContactFormPresenterOut) => (
  <form className={styles.form}>
    <label htmlFor="name">お名前</label>
    <input
      id="name"
      value={name}
      onChange={onChangeName}
      maxLength={50}
      required>
    </input>
    <label htmlFor="email">e-mail</label>
    <input
      id="email"
      inputMode="email"
      value={eMail}
      onChange={onChangeEMail}
      maxLength={50}
      required>
    </input>
    <label htmlFor="text">本文</label>
    <textarea
      className={styles.textArea}
      id="text"
      inputMode="text"
      value={text}
      onChange={onChangeText}
      rows={20}
      required
      maxLength={2000}
      >
    </textarea>
    <input className={styles.submit} type="button" value="submit" onClick={onSubmit}/>
  </form>
);

export const ContactForm = () => ContactFormView(ContactFormPresenter());
