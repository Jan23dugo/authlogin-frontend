import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
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

          <p>
            This is your protected dashboard. You can only see this page if you
            are logged in.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
