import { useState } from "react";
import { useAuth } from "./hooks/AuthProvider"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";
import "./Login.css"; // You can place additional styling in a separate CSS file

const url = process.env.REACT_APP_BACK_URL;
const protocol = process.env.REACT_APP_HTTPS === "true" ? "https" : "http";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${protocol}://${url}:3001/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Login failed");
        return;
      }
      
      const data = await response.json();
      const token = data.token;
      localStorage.setItem("authToken", token);

      login(); // Call login function to update the auth context
      navigate("/dashboard"); // Navigate to dashboard after successful login

    } catch (err) {
      setError("An error occurred during login");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;