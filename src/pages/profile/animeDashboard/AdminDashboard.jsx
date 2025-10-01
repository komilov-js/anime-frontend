import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../../utils/auth";
import "./AdminDashboard.scss"; // styling fayli

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchWithAuth("https://komilov1.pythonanywhere.com/api/users/admin-stats/")
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Ma'lumotni olishda xato");
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Panel</h1>
      <div className="stats-cards">
        <div className="card users-card">
          <h2>Barcha foydalanuvchilar</h2>
          <p>{stats.users_count}</p>
        </div>
        <div className="card active-card">
          <h2>Faol foydalanuvchilar</h2>
          <p>{stats.active_users}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
