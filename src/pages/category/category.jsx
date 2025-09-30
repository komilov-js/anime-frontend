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

  // 📌 responsive itemsPerPage
  const [itemsPerPage, setItemsPerPage] = useState(
    window.innerWidth <= 768 ? 12 : 15
  );

  useEffect(() => {
    // ekran o‘lchami o‘zgarsa yangilash
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

  const HeartIcon = ({ isFavorite }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={`heart-icon ${isFavorite ? "favorite" : ""}`}
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={isFavorite ? "#f60012" : "none"}
        stroke={isFavorite ? "#f60012" : "white"}
        strokeWidth="2"
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

  // 📌 pagination
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
                    <HeartIcon isFavorite={favorites[item.id]} />
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>Bu kategoriyada animelar mavjud emas</p>
        )}
      </div>

      {/* Pagination */}
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