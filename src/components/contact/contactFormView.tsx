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
  submitted,
  submitting,
}: ContactFormPresenterOut) => {
  const isDisable = () => (submitted || submitting);

  return (
    <form className={styles.form}>
      <label htmlFor="name">
        お名前
        {nameError && <span className={styles.error}>※お名前を入力してください</span>}
      </label>
      <input
        id="name"
        value={name}
        onChange={onChangeName}
        maxLength={50}
        required
        disabled={isDisable()}>
      </input>
      <label htmlFor="email">
        E-Mail
        {eMailError && <span className={styles.error}>※E-Mailの入力内容をご確認ください</span>}
      </label>
      <input
        id="email"
        inputMode="email"
        value={eMail}
        onChange={onChangeEMail}
        maxLength={50}
        required
        disabled={isDisable()}>
      </input>
      <label htmlFor="text">
        本文
        {textError && <span className={styles.error}>※本文を入力してください</span>}
      </label>
      <textarea
        className={styles.textArea}
        id="text"
        inputMode="text"
        value={text}
        onChange={onChangeText}
        rows={20}
        required
        maxLength={2000}
        disabled={isDisable()}
      >
      </textarea>
      <input
        className={styles.submit}
        type="button"
        value="送信"
        onClick={onSubmit}
        disabled={isDisable()} />
      {submitted && <label>お問い合わせありがとうございました！</label>}
    </form>
  );
}

export const ContactForm = () => ContactFormView(ContactFormPresenter());
