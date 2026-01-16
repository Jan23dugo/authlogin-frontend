import styles from "./FormSuccess.module.css";

const FormSuccess = ({ message }) => {
  if (!message) return null;

  return <div className={styles.success}>{message}</div>;
};

export default FormSuccess;
