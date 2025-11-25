
import styles from "./input.module.css";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = '', ...props }: Props) {
  return <input className={`${styles.input} ${className}`} {...props} />;
}