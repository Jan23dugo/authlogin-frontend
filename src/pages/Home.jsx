import { useNavigate } from "react-router-dom";
import Box from "../components/Box/Box";
import styles from "./Home.module.css"; // import module

function Home() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <Box
        title="Full Authentication System (Advanced Auth App)"
        description="Access your account here."
        buttonText="Login"
        buttonProps={{ onClick: goToLogin, variant: "primary", size: "md" }}
      />
    </div>
  );
}

export default Home;
