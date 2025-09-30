import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "../../components/pageAnime/pageAnime.scss";
import "../../components/loading/loading.scss";
import "./category.scss";
import { AuthContext } from "../../context/AuthContext";
import { fetchWithAuth } from "../../utils/auth";

const CategoryPage = () => {
  const { slug } = useParams();
  const [animes, setAnimes] = useState([]);
  const [favorites, setFavorites] = useState({}); // API'dan kelgan saqlanganlar
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(
    window.innerWidth <= 768 ? 12 : 15
  );
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth <= 768 ? 12 : 15);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // 🔹 kategoriyadagi animelarni olish
    const fetchAnimes = async () => {
      try {
        const res = await fetch(
          `https://komilov1.pythonanywhere.com/api/animes/?category=${slug}`
        );
        const data = await res.json();
        setAnimes(data);
        setCurrentPage(1);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Category animes fetch error:", error);
      }
    };

    fetchAnimes();

    // 🔹 foydalanuvchi tizimga kirgan bo‘lsa, saqlangan animelarni olish
    if (user) {
      fetchWithAuth("https://komilov1.pythonanywhere.com/api/saved-animes/")
        .then((res) => {
          if (Array.isArray(res)) {
            const favs = {};
            res.forEach((item) => {
              favs[item.anime.id] = true;
            });
            setFavorites(favs);
          }
        })
        .catch((err) => console.error("Error fetching saved animes:", err));
    }
  }, [slug, user]);

  // 🔹 Saqlash / o‘chirish tugmasi
  const toggleFavorite = async (anime, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Saqlash uchun tizimga kiring!");
      return;
    }

    const already = favorites[anime.id];

    if (already) {
      // 🔴 O‘chirish
      try {
        await fetchWithAuth(
          `https://komilov1.pythonanywhere.com/api/saved-animes/${anime.id}/`,
          { method: "DELETE" }
        );
        const updated = { ...favorites };
        delete updated[anime.id];
        setFavorites(updated);
      } catch (err) {
        console.error("Delete error:", err);
      }
    } else {
      // 🟢 Saqlash
      try {
        const res = await fetchWithAuth(
          "https://komilov1.pythonanywhere.com/api/saved-animes/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ anime_slug: anime.slug }),
          }
        );
        if (res && res.id) {
          setFavorites({ ...favorites, [anime.id]: true });
        }
      } catch (err) {
        console.error("Save error:", err);
      }
    }
  };

  // ✅ Saqlash (bookmark) SVG
  const SaveIcon = ({ isFavorite }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      className={`save-icon ${isFavorite ? "favorite" : ""}`}
    >
      <path
        d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"
        fill={isFavorite ? "#f60012" : "none"}
        stroke={isFavorite ? "#f60012" : "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (!animes || animes.length === 0) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const totalPages = Math.ceil(animes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedAnimes = animes.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (num) => {
    setCurrentPage(num);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page-anime">
      <h2 className="category-title">
        {slug.replace(/-/g, " ")} ({animes.length})
      </h2>

      <div className="anime-grid">
        {selectedAnimes.length > 0 ? (
          selectedAnimes.map((item) => (
            <div className="page-anime-container" key={item.id}>
              <Link to={`/anime/${item.slug}`}>
                <div className="card-img">
                  <div className="card-text">
                    <p>{item.year || "2024"}</p>
                  </div>
                  <img
                    src={
                      item.main_image ||
                      "https://via.placeholder.com/260x320/f7f8fa/333?text=Anime"
                    }
                    alt={item.title}
                  />
                  <div className="image-text">
                    <p>{item.title}</p>
                  </div>
                  <div
                    className="card-icon"
                    onClick={(e) => toggleFavorite(item, e)}
                  >
                    <SaveIcon isFavorite={favorites[item.id]} />
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>Bu kategoriyada animelar mavjud emas</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={currentPage === num ? "active" : ""}
              onClick={() => handlePageChange(num)}
            >
              {num}
            </button>
          ))}

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
    </div>
  );
};

export default CategoryPage;
