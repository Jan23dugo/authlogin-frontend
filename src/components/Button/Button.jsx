import styles from "./Button.module.css";

function Button({ children, variant = "primary", size = "md", ...props }) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      {...props}
    >
      {children}
    </button>
  );
} 

export default Button;
