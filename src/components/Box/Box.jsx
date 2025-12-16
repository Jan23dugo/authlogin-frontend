import styles from "./Box.module.css";
import Button from "../Button/Button";

function Box({ title, description, buttonText, buttonProps }) {
  return (
    <div className={styles.box}>
      <h2 className={styles.box - title}>{title}</h2>
      <p className={styles.box - description}>{description}</p>
      <Button {...buttonProps}>{buttonText}</Button>
    </div>
  );
}

export default Box;
