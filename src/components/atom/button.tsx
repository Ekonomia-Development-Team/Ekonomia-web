import styles from "./button.module.css";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'ghost';
};

export default function Button({ variant = 'default', className = '', children, ...props }: Props) {
  const variantClass =
    variant === 'secondary' ? styles.secondary : variant === 'ghost' ? styles.ghost : '';

  return (
    <button className={`${styles.rootButton} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
