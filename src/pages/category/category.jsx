import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../components/pageAnime/pageAnime.scss";
import "../../components/loading/loading.scss";
import "./category.scss";

const CategoryPage = () => {
  const { slug } = useParams();
  const [animes, setAnimes] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
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

    const storedFavorites =
      JSON.parse(localStorage.getItem("animeFavorites")) || {};
    setFavorites(storedFavorites);
  }, [slug]);

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedFavorites = { ...favorites };
    if (updatedFavorites[id]) {
      delete updatedFavorites[id];
    } else {
      updatedFavorites[id] = true;
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("animeFavorites", JSON.stringify(updatedFavorites));
  };

  // ✅ Saqlash (bookmark) SVG shu yerda
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
        fill={isFavorite ? "#f60012" : "none"}     // 🔴 bosilganda qizil
        stroke={isFavorite ? "#f60012" : "white"} // kontur rangi
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
                    onClick={(e) => toggleFavorite(item.id, e)}
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
