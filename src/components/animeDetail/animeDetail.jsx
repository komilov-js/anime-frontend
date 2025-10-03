// pages/animeDetail/AnimeDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import "./animeDetail.scss";
import { FaTelegramPlane } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { fetchWithAuth } from "../../utils/auth";
import "../loading/loading.scss";
import YandexAd2 from "../../yandexAds/ad2/ad2";

export default function AnimeDetail() {
  const { slug } = useParams();
  const [anime, setAnime] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [saved, setSaved] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await fetch(
          `https://komilov1.pythonanywhere.com/api/animes/${slug}/`
        );
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setAnime(data);

        if (data.seasons && data.seasons.length > 0) {
          setCurrentSeason(data.seasons[0]);
          if (data.seasons[0].episodes.length > 0) {
            setCurrentEpisode(data.seasons[0].episodes[0]);
          }
        }

        if (user) {
          try {
            const savedRes = await fetchWithAuth(
              `https://komilov1.pythonanywhere.com/api/saved-animes/`
            );
            if (savedRes && Array.isArray(savedRes)) {
              const alreadySaved = savedRes.some(
                (item) => item.anime.slug === data.slug
              );
              setSaved(alreadySaved);
            }
          } catch (err) {
            console.error("Saved list fetch error:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching anime:", err);
      }
    };

    fetchAnime();
  }, [slug, user]);

  const handleSave = async () => {
    if (!user) {
      alert("Iltimos, saqlash uchun tizimga kiring!");
      return;
    }

    try {
      const res = await fetchWithAuth(
        `https://komilov1.pythonanywhere.com/api/saved-animes/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ anime_slug: anime.slug }),
        }
      );

      if (res && res.id) {
        setSaved(true);
      } else if (res?.detail?.includes("allaqachon saqlagansiz")) {
        setSaved(true);
      } else {
        alert("Saqlashda xatolik yuz berdi");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Saqlashda xatolik yuz berdi");
    }
  };

  if (!anime) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  // SEO uchun dinamik ma'lumotlar
  const seoTitle = `${anime.title}${
    currentSeason ? ` — ${currentSeason.title}` : ""
  }${
    currentEpisode && currentSeason?.episodes.length > 1
      ? ` — ${currentEpisode.episode_number}-qism ${currentEpisode.title || ""}`
      : ""
  } | Anivibe - O'zbekcha Anime`;

  const seoDescription = `${
    anime.description?.slice(0, 150) || `${anime.title} anime seriali`
  }${
    currentSeason ? ` ${currentSeason.title}` : ""
  }${
    currentEpisode && currentSeason?.episodes.length > 1
      ? ` ${currentEpisode.episode_number}-qism`
      : ""
  }. ${anime.genre || "Anime"} | ${anime.year || "2024"} | HD sifratda`;

  const seoImage = anime.bg_image || "https://anivibe.uz/logo.png";
  const seoUrl = `https://anivibe.uz/anime/${slug}`;

  // Schema.org ma'lumotlari
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": anime.title,
    "description": anime.description?.slice(0, 200) || seoDescription,
    "image": seoImage,
    "genre": anime.genre || "Anime",
    "dateCreated": anime.year || "2024",
    "director": {
      "@type": "Person",
      "name": anime.director || "Noma'lum"
    },
    "productionCompany": {
      "@type": "Organization",
      "name": anime.studio || "Noma'lum"
    },
    "countryOfOrigin": anime.country || "Japan",
    "contentRating": anime.yosh_chegara || "15+",
    "url": seoUrl
  };

  // Video episode bo'lsa VideoObject schema qo'shamiz
  if (currentEpisode) {
    schemaData["@type"] = "VideoObject";
    schemaData.name = seoTitle;
    schemaData.description = seoDescription;
    schemaData.thumbnailUrl = seoImage;
    schemaData.uploadDate = new Date().toISOString().split('T')[0];
    schemaData.contentUrl = currentEpisode.video_file || currentEpisode.video_url;
    schemaData.embedUrl = currentEpisode.video_url || seoUrl;
  }

  return (
    <div
      className="anime-detail"
      style={{
        backgroundImage: `url(${anime.bg_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* ✅ Mukammal SEO Optimizatsiya */}
      <Helmet>
        {/* Asosiy SEO Meta Teqlari */}
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta 
          name="keywords" 
          content={`${anime.title}, ${currentSeason?.title || ""}, ${
            currentEpisode?.title || ""
          }, ${anime.genre}, anime, anivibe, o'zbekcha anime, ${anime.year || "2024"}, HD anime`} 
        />
        
        {/* Texnik Meta Teqlari */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={seoUrl} />
        
        {/* Tillar uchun Alternativ URLlar */}
        <link rel="alternate" hreflang="uz" href={seoUrl} />
        <link rel="alternate" hreflang="ru" href={`${seoUrl}?lang=ru`} />
        <link rel="alternate" hreflang="x-default" href={seoUrl} />
        
        {/* Open Graph (Facebook) */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={seoImage} />
        <meta property="og:url" content={seoUrl} />
        <meta property="og:type" content="video.movie" />
        <meta property="og:site_name" content="Anivibe" />
        <meta property="og:locale" content="uz_UZ" />
        {currentEpisode && (
          <>
            <meta property="og:video" content={currentEpisode.video_file || currentEpisode.video_url} />
            <meta property="og:video:type" content="video/mp4" />
            <meta property="og:video:width" content="1280" />
            <meta property="og:video:height" content="720" />
          </>
        )}
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={seoImage} />
        <meta name="twitter:site" content="@anivibe" />
        <meta name="twitter:creator" content="@anivibe" />
        
        {/* Qo'shimcha Meta Teqlar */}
        <meta name="author" content="Anivibe" />
        <meta name="copyright" content="Anivibe" />
        <meta name="application-name" content="Anivibe" />
        
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
        
        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Asosiy",
                "item": "https://anivibe.uz"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Anime",
                "item": "https://anivibe.uz/anime"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": anime.title,
                "item": seoUrl
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="anime-detail-container">
        <div className="anime-video">
          {currentEpisode?.video_file ? (
            <video key={currentEpisode.video_file} controls autoPlay>
              <source src={currentEpisode.video_file} type="video/mp4" />
              Sizning brauzeringiz video formatini qo'llamaydi.
            </video>
          ) : currentEpisode?.video_url ? (
            currentEpisode.video_url.trim().startsWith("<iframe") ? (
              <div
                key={currentEpisode.video_url}
                dangerouslySetInnerHTML={{ __html: currentEpisode.video_url }}
              />
            ) : (
              <iframe
                key={currentEpisode.video_url}
                src={currentEpisode.video_url}
                title={anime.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )
          ) : (
            <p>Hozircha video mavjud emas</p>
          )}

          <div className="video-actions">
            <button onClick={handleSave} disabled={saved}>
              {saved ? "Saqlandi ✅" : "Saqlash"}
            </button>
            <a href="https://t.me/anivibe_official" target="_blank" rel="noopener noreferrer">
              Telegram Kanalimizga Qo'shiling <FaTelegramPlane />
            </a>
          </div>

          {/* Fasllar */}
          {anime.seasons?.length > 1 && (
            <div className="season-list">
              <h3>Fasllar</h3>
              <div className="seasons">
                {anime.seasons.map((season) => (
                  <div
                    key={season.id}
                    className={`season ${
                      currentSeason?.id === season.id ? "current" : ""
                    }`}
                    onClick={() => {
                      setCurrentSeason(season);
                      setCurrentEpisode(season.episodes[0] || null);
                    }}
                  >
                    {season.season_number}-fasl
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Qismlar yoki Film */}
          {currentSeason && currentSeason.episodes.length > 0 && (
            <div className="episode-list">
              {currentSeason.episodes.length === 1 ? (
                <div className="episodes">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      justifyContent: "center",
                    }}
                    key={currentSeason.episodes[0].id}
                    className="episode current film"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-film"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z" />
                    </svg>{" "}
                    Film
                  </div>
                </div>
              ) : (
                <>
                  <h3>Qismlar</h3>
                  <div className="episodes">
                    {currentSeason.episodes.map((ep) => (
                      <div
                        key={ep.id}
                        className={`episode ${
                          currentEpisode?.id === ep.id ? "current" : ""
                        }`}
                        onClick={() => setCurrentEpisode(ep)}
                      >
                        {ep.episode_number}-qism
                        <br />
                        {ep.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="anime-detail-text">
          <div className="anime-detail-text-text">
            <div
              className="anime-titles"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {currentSeason && (
                <h1 className="season-title">
                  {anime.title} {currentSeason.title}
                </h1>
              )}
            </div>
            <p>{anime.description}</p>
            <div className="anime-meta">
              <div className="meta-item">
                <h3>Mamlakat</h3>
                <p>{anime.country || "Yaponiya"}</p>
              </div>
              <div className="meta-item">
                <h3>Rejissor</h3>
                <p>{anime.director || "Miyuki Kuroki"}</p>
              </div>
              <div className="meta-item">
                <h3>Studiya</h3>
                <p>{anime.studio || "CloverWorks"}</p>
              </div>
              <div className="meta-item">
                <h3>Janr</h3>
                <p>{anime.genre || "Anime"}</p>
              </div>
              <div className="meta-item">
                <h3>Yosh chegarasi</h3>
                <p>{anime.yosh_chegara || "15+"}</p>
              </div>
              <div className="meta-item">
                <h3>Yil</h3>
                <p>{anime.year || "2024"}</p>
              </div>
            </div>
          </div>
          <div className="ad-block">
            <YandexAd2 />
          </div>
        </div>
      </div>
    </div>
  );
}