// Register.js
import React, { useState, useContext } from "react";
import "../login/login.scss";
import logo from "./logo-login.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import '../../../components/loading/loading.scss';

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const translateErrors = (data) => {
    let translated = {};
    if (data.username) translated.username = "Foydalanuvchi nomi allaqachon mavjud yoki noto‘g‘ri.";
    if (data.email) translated.email = "Elektron pochta noto‘g‘ri yoki ro‘yxatdan o‘tgan.";
    if (data.password) translated.password = "Parol juda oddiy yoki xato.";
    if (data.password2) translated.password2 = "Parollar mos emas.";
    if (data.detail) translated.detail = "Ro‘yxatdan o‘tishda xatolik yuz berdi.";
    return translated;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      let response = await fetch("https://komilov1.pythonanywhere.com/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data = await response.json();

      if (!response.ok) {
        setErrors(translateErrors(data));
        return;
      }

      // login qilish
      let loginRes = await fetch("https://komilov1.pythonanywhere.com/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      let tokens = await loginRes.json();
      localStorage.setItem("access", tokens.access);
      localStorage.setItem("refresh", tokens.refresh);

      // profilni olish
      let meRes = await fetch("https://komilov1.pythonanywhere.com/api/users/me/", {
        headers: { Authorization: `Bearer ${tokens.access}` },
      });

      let meData = await meRes.json();
      setUser(meData);

      alert("Hisob muvaffaqiyatli yaratildi!");
      navigate("/profile");
    } catch (error) {
      alert("Xatolik yuz berdi: " + error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>

      <div className="register-container">
        <div className="login-text">
          <img src={logo} alt="logo" />
          <h1>Ro‘yxatdan o‘tish</h1>
        </div>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Foydalanuvchi nomi"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <p className="error">{errors.username}</p>}

          <input
            type="email"
            placeholder="Elektron pochta"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="password"
            placeholder="Parol"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <input
            type="password"
            placeholder="Parolni tasdiqlang"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            required
          />
          {errors.password2 && <p className="error">{errors.password2}</p>}

          <button type="submit">Hisob yaratish</button>
        </form>

        {errors.detail && <p className="error">{errors.detail}</p>}

        <div className="link-login">
          <p>Hisobingiz bormi?</p>
          <Link to="/login">Kirish</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
