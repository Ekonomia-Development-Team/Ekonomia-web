import styles from "./button.module.css";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary";
};

export default function Button({ variant = "default", className = "", children, ...props }: Props) {
  const variantClass = variant === "secondary" ? styles.secondary : "";
  return (
    <button className={`${styles.rootButton} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
