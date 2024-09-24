import { useState } from "react";
import { useAuth } from "./hooks/AuthProvider"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";
import "./Login.css"; // You can place additional styling in a separate CSS file

const url = process.env.REACT_APP_BACK_URL;
const protocol = process.env.REACT_APP_HTTPS === "true" ? "https" : "http";

const FirstLogin = () => {
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    try {
      if (password !== passwordCheck) {
        setError("Passwords are not identical");
        return;
      }

      const response = await fetch(`${protocol}://${url}:3001/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Can't change password");
        return;
      }

      navigate("/dashboard"); // Navigate to dashboard after successful login

    } catch (err) {
      setError("An error occurred during login");
    }
  };

  return (
    <div className="login-container">
      <h2>Create new password</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="password">New password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="Enter your password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Retype password</label>
          <input
            type="password"
            id="password"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            className="form-input"
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="login-button">Update password</button>
      </form>
    </div>
  );
};

export default FirstLogin;