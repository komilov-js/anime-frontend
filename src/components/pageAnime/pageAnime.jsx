import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './pageAnime.scss';
import '..//loading/loading.scss';
import YandexAd from '../../yandexAds/ad1/ad1';
import { AuthContext } from "../../context/AuthContext";
import { fetchWithAuth } from '../../utils/auth';

const PageAnime = () => {
  const [animePage, setAnimePage] = useState([]);
  const [savedList, setSavedList] = useState([]);  // saqlangan anime sluglari
  const [limit, setLimit] = useState(15);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // 📱 Telefon va 💻 Kompyuter uchun limitni sozlash
    const updateLimit = () => {
      if (window.innerWidth <= 768) {
        setLimit(12); // Telefon
      } else {
        setLimit(15); // Kompyuter
      }
    };

    updateLimit(); // boshlanishida ishga tushadi
    window.addEventListener("resize", updateLimit);

    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  useEffect(() => {
    // Anime ro'yxatini API’dan olish
    fetch('https://komilov1.pythonanywhere.com/api/animes/')
      .then(res => res.json())
      .then(data => setAnimePage(data))
      .catch(error => console.error('Error fetching anime data:', error));

    // Agar foydalanuvchi mavjud bo‘lsa, saqlangan animelarni API’dan olish
    if (user) {
      fetchWithAuth('https://komilov1.pythonanywhere.com/api/saved-animes/')
        .then(res => {
          if (Array.isArray(res)) {
            const slugs = res.map(item => item.anime.slug);
            setSavedList(slugs);
          }
        })
        .catch(err => console.error("Error fetching saved animes:", err));
    }
  }, [user]);

  const toggleSave = async (anime) => {
    if (!user) {
      alert("Iltimos, saqlash uchun tizimga kiring!");
      return;
    }
    const slug = anime.slug;
    const already = savedList.includes(slug);

    if (already) {
      const newList = savedList.filter(s => s !== slug);
      setSavedList(newList);
      // backend delete bo‘lsa shu yerda qo‘shasan
    } else {
      try {
        const res = await fetchWithAuth('https://komilov1.pythonanywhere.com/api/saved-animes/', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ anime_slug: slug }),
        });
        if (res && res.id) {
          setSavedList(prev => [...prev, slug]);
        } else {
          console.error("Save API response:", res);
        }
      } catch (err) {
        console.error("Error saving anime:", err);
      }
    }
  };

  // SVG Save (bookmark) ikonkasi
  const SaveIcon = ({ isSaved }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={`save-icon ${isSaved ? 'saved' : ''}`}
    >
      <path
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        fill={isSaved ? "#f60012" : "none"}
        stroke={isSaved ? "#f60012" : "white"}
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
        {animePage.slice(0, limit).map(item => {
          const isSaved = savedList.includes(item.slug);
          return (
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSave(item);
                    }}
                  >
                    <SaveIcon isSaved={isSaved} />
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
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

      <div className="ad-block">
        <YandexAd />
      </div>
    </div>
  );
};

export default PageAnime;
