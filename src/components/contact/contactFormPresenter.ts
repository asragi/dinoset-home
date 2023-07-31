"use client"
import { sendMail } from "@/utils/sendMail";
import { ChangeEventHandler, MouseEventHandler, useState } from "react";

const namePlaceHolder = "";
const mailPlaceHolder = "";
const textPlaceHolder = "";
const eMailRegExp = /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

export type ContactFormPresenterOut = {
  name: string;
  onChangeName: ChangeEventHandler<HTMLInputElement>;
  eMail: string;
  onChangeEMail: ChangeEventHandler<HTMLInputElement>;
  text: string;
  onChangeText: ChangeEventHandler<HTMLTextAreaElement>;
  onSubmit: MouseEventHandler<HTMLInputElement>;
  nameError: boolean;
  eMailError: boolean;
  textError: boolean;
  submitting: boolean;
  submitted: boolean;
};

export const ContactFormPresenter = (): ContactFormPresenterOut => {
  const [name, setName] = useState(namePlaceHolder);
  const [eMail, setEMail] = useState(mailPlaceHolder);
  const [text, setText] = useState(textPlaceHolder);
  const [nameError, setNameError] = useState(false);
  const [eMailError, setEMailError] = useState(false);
  const [textError, setTextError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const hasValue = (value: string): boolean => (!!value);

  const isNameValid = (value: string) => {
    if (!hasValue(value)) return false;
    return true;
  }

  const isEmailValid = (value: string) => {
    if (!hasValue(value)) return false;
    const matchRegExp = eMailRegExp.test(value);
    if (!matchRegExp) return false;
    return true;
  }

  const isTextValid = (value: string) => {
    if (!hasValue(value)) return false;
    return true;
  }

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const afterName = e.target.value;
    setName(afterName);
    if (nameError && isNameValid(afterName)) {
      setNameError(false);
    }
  };

  const onChangeEMail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const afterMail = e.target.value;
    setEMail(afterMail);
    if (eMailError && isEmailValid(afterMail)) {
      setEMailError(false);
    }
  };

  const onChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const afterText = e.target.value;
    setText(afterText);
    if (textError && isTextValid(afterText)) {
      setTextError(false);
    }
  };

  const onSubmit = () => {
    let nameErrorTmp = false;
    let eMailErrorTmp = false;
    let textErrorTmp = false;
    if (!isNameValid(name)) {
      console.warn("invalid name");
      nameErrorTmp = true;
    }
    if (!isEmailValid(eMail)) {
      console.warn("invalid email");
      eMailErrorTmp = true;
    }
    if (!isTextValid(text)) {
      console.warn("invalid text");
      textErrorTmp = true;
    }
    setNameError(nameErrorTmp);
    setEMailError(eMailErrorTmp);
    setTextError(textErrorTmp);
    console.log(name);
    console.log(eMail);
    console.log(text);

    if (nameErrorTmp || eMailErrorTmp || textErrorTmp) {
      return;
    }

    submit();
  };

  const submit = () => {
    setSubmitting(true);
    sendMail(
      {
        from_name: name,
        email: eMail,
        message: text,
      }
    )
      .then(() => {
        setSubmitted(true);
        setSubmitting(false);
        console.log(`SUBMIT SUCCSESS`);
      })
      .catch((e: Error) => {
        setSubmitting(false);
        setTimeout(() => { throw e; });
      });
  }

  return {
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
    submitting,
    submitted,
  }
};