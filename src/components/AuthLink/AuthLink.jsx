import { useNavigate } from "react-router-dom";
import styles from "./AuthLink.module.css";

const AuthLink = ({ to, children, align = "left" }) => {
  const navigate = useNavigate();

  return (
    <div className={`${styles.wrapper} ${styles[align]}`}>
      <button
        type="button"
        className={styles.link}
        onClick={() => navigate(to)}
      >
        {children}
      </button>
    </div>
  );
};

export default AuthLink;
