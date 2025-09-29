// Login.js
import React, { useState, useContext } from "react";
import "./login.scss";
import logo from "./logo-login.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import '../../../components/loading/loading.scss';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let response = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data = await response.json();

      if (!response.ok) {
        if (data.detail) {
          setError("Login yoki parol noto‘g‘ri.");
        } else {
          setError("Kirishda xatolik yuz berdi.");
        }
        return;
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      let profileRes = await fetch("http://127.0.0.1:8000/api/users/me", {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      let profileData = await profileRes.json();
      setUser(profileData);

      navigate("/profile");
    } catch (error) {
      setError("Xatolik yuz berdi: " + error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>
      <div className="login-container">
        <div className="login-text">
          <img src={logo} alt="" />
          <h1>Kirish</h1>
        </div>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Foydalanuvchi nomi"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Parol"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Kirish</button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="link-create">
          <p>Siz yangimisiz Uz-anime?</p>
          <Link to="/register">Yangi foydalanuvchi yaratish!</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
