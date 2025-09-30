// context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
    const navigate = useNavigate();
  

  // dastlab token bo‘lsa profilni chaqirib olish
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      fetchWithAuth("https://komilov1.pythonanywhere.com/api/animes/api/users/me/")
        .then((data) => {
          if (data && !data.detail) {
            setUser(data);
          } else {
            setUser(null);
          }
        })
        .catch((err) => {
          console.error("AuthContext error:", err.message);
          // faqat session expired bo‘lsa logout qilamiz
          if (err.message.includes("Session expired")) {
            setUser(null);
          }
        });
    }
  }, []); 


  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    navigate("/")

  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
