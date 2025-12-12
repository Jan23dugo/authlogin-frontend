import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to My App</h1>
      <button onClick={goToLogin}>Go to Login</button>
    </div>
  );
}

export default Home;
