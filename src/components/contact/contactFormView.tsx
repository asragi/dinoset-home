"use client"
import { ContactFormPresenter, ContactFormPresenterOut } from "./contactFormPresenter";

const ContactFormView = ({
  name,
  onChangeName,
  eMail,
  onChangeEMail,
  text,
  onChangeText,
  onSubmit,
}: ContactFormPresenterOut) => (
  <form onSubmit={onSubmit}>
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
    <input
      id="text"
      inputMode="text"
      value={text}
      onChange={onChangeText}>
    </input>
    <input type="submit" value="submit"/>
  </form>
);

export const ContactForm = () => ContactFormView(ContactFormPresenter());
