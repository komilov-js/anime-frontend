import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './pageAnime.scss';
import '..//loading/loading.scss';


const PageAnime = () => {
  const [animePage, setAnimePage] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [limit, setLimit] = useState(15); // default 5 ta

  useEffect(() => {
    // API dan ma'lumotlarni olish
    fetch('http://127.0.0.1:8000/api/animes/')
      .then(res => res.json())
      .then(data => setAnimePage(data))
      .catch(error => console.error('Error fetching anime data:', error));

    // LocalStorage'dan sevimlilarni yuklash
    const storedFavorites = JSON.parse(localStorage.getItem('animeFavorites')) || {};
    setFavorites(storedFavorites);

    // Ekran o'lchamiga qarab limit o'rnatish
    const updateLimit = () => {
      if (window.innerWidth <= 768) {
        setLimit(12); // telefon holatida 12 ta
      } else {
        setLimit(15); // kompyuter holatida 5 ta
      }
    };

    updateLimit(); // dastlab ishga tushirish
    window.addEventListener('resize', updateLimit);

    return () => window.removeEventListener('resize', updateLimit);
  }, []);

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
    localStorage.setItem('animeFavorites', JSON.stringify(updatedFavorites));
  };

  // SVG Heart ikonkasi
  const HeartIcon = ({ isFavorite }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={`heart-icon ${isFavorite ? 'favorite' : ''}`}
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={isFavorite ? "#f60012" : "none"}
        stroke={isFavorite ? "#f60012" : "white"}
        strokeWidth="2"
      />
    </svg>
  );
  if (!animePage || animePage.length === 0) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }


  return (
    <div className='page-anime'>
      <div className="anime-grid">
        {animePage.slice(0, limit).map(item => (
          <div className='page-anime-container' key={item.id}>
            <Link to={`/anime/${item.slug}`}>
              <div className="card-img">
                <div className='card-text'>
                  <p>{item.year || '2024'}</p>
                </div>
                <img
                  src={item.main_image || "https://via.placeholder.com/260x320/f7f8fa/333?text=Anime"}
                  alt={item.title}
                />
                <div className="image-text">
                  <p>{item.title}</p>
                </div>
                <div
                  className='card-icon'
                  onClick={(e) => toggleFavorite(item.id, e)}
                >
                  <HeartIcon isFavorite={favorites[item.id]} />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <Link to='/category/hamma-animlar' id='hammasi'>
        Barchasini Ko'rsatish
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-right"
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"
          className="svg-inline--fa fa-angle-right fa-w-8">
          <path fill="currentColor"
            d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6
                   c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4
                   c-9.4-9.4-9.4-24.6 0-33.9L54.3 103
                   c9.4-9.4 24.6-9.4 33.9 0l136 136
                   c9.5 9.4 9.5 24.6.1 34z">
          </path>
        </svg>
      </Link>
    </div>
  );
};

export default PageAnime;
