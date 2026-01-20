import AuthLink from "../AuthLink/AuthLink";
import styles from "./AuthSwitchText.module.css";

const AuthSwitchText = ({ text, linkText, to }) => {
  return (
    <div className={styles.text}>
      {text} <AuthLink to={to}>{linkText}</AuthLink>
    </div>
  );
};

export default AuthSwitchText;
