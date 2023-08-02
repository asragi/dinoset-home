"use client"
import styles from "./mailButton.module.scss";
import { CommonSNSButton } from "./commonSNSButton";

interface Props {
  eMail: string;
  size: number;
  className?: string;
}

const alt = "Mail Link";
const src = "./mail.svg";

export const MailButton = ({ eMail, size, className }: Props) => {
  const newClassName = `${className} ${styles.mail}`;

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // スパム回避のため"&&"を"@"として代替しているので実行時に戻す
    const target = `mailto:${eMail.replace("&&", "@")}`;
    location.href = target;
  };

  const props = {
    href: "",
    src,
    size,
    alt,
    onClick,
    className: newClassName,
  };
  return <CommonSNSButton {...props} />;
};
