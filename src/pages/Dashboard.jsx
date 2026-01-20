import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import styles from "./Dashboard.module.css";
import TwoFactor from "../components/TwoFactor/TwoFactor";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    try {
      if (storedUser && storedUser !== "undefined") {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      // If data is corrupt, return null so the app doesn't crash
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // Check if token is missing OR if it is the string "undefined"
    if (
      !token ||
      token === "undefined" ||
      !storedUser ||
      storedUser === "undefined"
    ) {
      // Clear the bad data automatically
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>AuthLogin</div>
        <Button variant="secondary" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </nav>

      <main className={styles.content}>
        <div className={styles.card}>
          <h1>Welcome back, {user.firstName}! 👋</h1>

          <div className={styles.divider}></div>

          <div className={styles.divider}></div>
          <TwoFactor user={user} setUser={setUser} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
