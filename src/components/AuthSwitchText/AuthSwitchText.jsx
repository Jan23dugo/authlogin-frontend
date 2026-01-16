import AuthLink from "../AuthLink/AuthLink";
import styles from "./AuthSwitchText.module.css";

const AuthSwitchText = ({ text, linkText, to }) => {
  return (
    <p className={styles.text}>
      {text} <AuthLink to={to}>{linkText}</AuthLink>
    </p>
  );
};

export default AuthSwitchText;
