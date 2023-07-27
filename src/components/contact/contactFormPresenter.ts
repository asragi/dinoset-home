"use client"
import { ChangeEventHandler, useState } from "react";

const namePlaceHolder = "Name";
const mailPlaceHolder = "Mail";
const textPlaceHolder = "Text";

export type ContactFormPresenterOut = {
  name: string;
  onChangeName: any;
  eMail: string;
  onChangeEMail: any;
  text: string;
  onChangeText: ChangeEventHandler<HTMLTextAreaElement>;
  onSubmit: any;
};

export const ContactFormPresenter = (): ContactFormPresenterOut => {
  const [name, setName] = useState(namePlaceHolder);
  const [eMail, setEMail] = useState(mailPlaceHolder);
  const [text, setText] = useState(textPlaceHolder);

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const afterName = e.target.value;
    setName(afterName);
  };

  const onChangeEMail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const afterMail = e.target.value;
    setEMail(afterMail);
  };

  const onChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const afterText = e.target.value;
    setText(afterText);
  };

  const onSubmit = () => {
    console.log(name);
    console.log(eMail);
    console.log(text);
  };

  return {
    name,
    onChangeName,
    eMail,
    onChangeEMail,
    text,
    onChangeText,
    onSubmit,
  }
};