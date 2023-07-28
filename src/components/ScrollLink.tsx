"use client"
import { Link as Scroll } from "react-scroll";
import styles from "./ScrollLink.module.scss";

export const ScrollLink = (
  { to, text, className }: { to: string, text: string, className?: string}
) => (
  <Scroll
  to={to}
  smooth
  offset={-100}
  className={`${className} ${styles.link}`}>
    {text}
  </Scroll>
);
