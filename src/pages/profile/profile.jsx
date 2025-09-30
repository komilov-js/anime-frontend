import React, { useContext, useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/auth";
import "./profile.scss";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "../../components/loading/loading.scss";
import defImg from "../../imgs/default.jpg";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [savedAnimes, setSavedAnimes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { logout } = useContext(AuthContext);

  // 📌 responsive itemsPerPage
  const [itemsPerPage, setItemsPerPage] = useState(
    window.innerWidth <= 768 ? 12 : 15
  );

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth <= 768 ? 12 : 15);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Profil ma'lumotlarini olish
    fetchWithAuth("https://komilov1.pythonanywhere.com/api/users/me/")
      .then((data) => setProfile(data))
      .catch((err) => console.error("Profile olishda xato:", err));

    // Saqlangan animelarni olish
    fetchWithAuth("https://komilov1.pythonanywhere.com/api/saved-animes/")
      .then((data) => setSavedAnimes(data))
      .catch((err) => console.error("Saved animelarni olishda xato:", err));
  }, []);

  // 📌 SVG Save (Bookmark) ikonka
  const SaveIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="save-icon saved"
    >
      <path
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        fill="#f60012"
        stroke="#f60012"
        strokeWidth="2"
      />
    </svg>
  );

  if (!profile || profile.length === 0) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  // 📌 Pagination hisoblash
  const totalPages = Math.ceil(savedAnimes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedAnimes = savedAnimes.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (num) => {
    setCurrentPage(num);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <img
          className="profile-img"
          src={`${
            profile?.profile_img != null
              ? `https://komilov1.pythonanywhere.com${profile?.profile_img}`
              : defImg
          }`}
          alt={profile?.username}
        />
        <ul>
          <li>
            <strong>ID:</strong> {profile.id}
          </li>
          <li>
            <strong>Foydalanuvchi nomi:</strong> {profile.username}
          </li>
          <li>
            <strong>Email:</strong> {profile.email}
          </li>
        </ul>
        <button className="anime-logout-btn" onClick={logout}>
          <svg
            style={{ width: 18, height: 18, marginRight: 8 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M16 17l5-5-5-5"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12H9"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Chiqish
        </button>
      </div>

      <div className="saved-animes">
        <h3>Siz saqlagan animelar:</h3>
        {savedAnimes.length > 0 ? (
          <>
            <div className="anime-grid">
              {selectedAnimes.map((item) => (
                <div className="page-anime-container" key={item.id}>
                  <Link to={`/anime/${item.anime.slug}`}>
                    <div className="card-img">
                      {item.anime.year && (
                        <div className="card-text">
                          <p>{item.anime.year || 2024}</p>
                        </div>
                      )}
                      <img
                        src={item.anime.main_image}
                        alt={item.anime.title}
                      />
                      <div className="image-text">
                        <p>{item.anime.title}</p>
                      </div>
                      {/* ✅ Save icon yurak o‘rnida */}
                      <div className="card-icon">
                        <SaveIcon />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() =>
                    handlePageChange(Math.max(currentPage - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      className={currentPage === num ? "active" : ""}
                      onClick={() => handlePageChange(num)}
                    >
                      {num}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        ) : (
          <p>Hali hech qanday anime saqlanmadi.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
