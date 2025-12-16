import styles from "./FormSuccess.module.css";

function FormSuccess({ message }) {
  if (!message) return null;

  return <div className={styles.success}>{message}</div>;
}

export default FormSuccess;
