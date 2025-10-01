// pages/animeDetail/AnimeDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async"; // ✅ SEO uchun
import "./animeDetail.scss";
import { FaTelegramPlane } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { fetchWithAuth } from "../../utils/auth";
import "..//loading/loading.scss";

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
                const res = await fetch(`https://komilov1.pythonanywhere.com/api/animes/${slug}/`);
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
            alert("Iltimos, saqlash uchun avval tizimga kiring!");
            return;
        }

        try {
            const res = await fetchWithAuth(`https://komilov1.pythonanywhere.com/api/saved-animes/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ anime_slug: anime.slug }),
            });

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


useEffect(() => {
    if (!anime) return;

    // Title
    const title = `${anime.title}${currentSeason ? ` — ${currentSeason.title}` : ""}${
        currentEpisode && currentSeason?.episodes.length > 1 ? ` — ${currentEpisode.episode_number}-qism ${currentEpisode.title || ""}` : ""
    } — Anivibe`;
    document.title = title;

    // Description
    const description = currentEpisode?.title
        ? `${anime.description?.slice(0, 160) || ""} — ${currentSeason?.title || ""} ${currentEpisode?.title}`
        : anime.description?.slice(0, 160) || "Anime haqida ma'lumot";

    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) metaDescription.setAttribute("content", description);

    const metaKeywords = document.querySelector("meta[name='keywords']");
    if (metaKeywords)
        metaKeywords.setAttribute(
            "content",
            `${anime.title}, ${currentSeason?.title || ""}, ${currentEpisode?.title || ""}, ${anime.genre}, anime, anivibe, o‘zbekcha anime`
        );

    // Open Graph
    const ogTitle = document.querySelector("meta[property='og:title']");
    if (ogTitle) ogTitle.setAttribute("content", title);

    const ogDescription = document.querySelector("meta[property='og:description']");
    if (ogDescription) ogDescription.setAttribute("content", description);

    const ogImage = document.querySelector("meta[property='og:image']");
    if (ogImage) ogImage.setAttribute("content", anime.bg_image || "https://anivibe.uz/logo.png");

    const ogUrl = document.querySelector("meta[property='og:url']");
    if (ogUrl) ogUrl.setAttribute("content", `https://anivibe.uz/anime/${slug}`);

    // Twitter
    const twitterTitle = document.querySelector("meta[name='twitter:title']");
    if (twitterTitle) twitterTitle.setAttribute("content", title);

    const twitterDescription = document.querySelector("meta[name='twitter:description']");
    if (twitterDescription) twitterDescription.setAttribute("content", description);

    const twitterImage = document.querySelector("meta[name='twitter:image']");
    if (twitterImage) twitterImage.setAttribute("content", anime.bg_image || "https://anivibe.uz/logo.png");
}, [anime, currentSeason, currentEpisode, slug]);



    if (!anime) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
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

            <div className="anime-detail-container">
                <div className="anime-video">
                    {currentEpisode?.video_file ? (
                        <video key={currentEpisode.video_file} controls autoPlay>
                            <source src={currentEpisode.video_file} type="video/mp4" />
                            Sizning brauzeringiz video formatini qo‘llamaydi.
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
                        <a href="https://t.me/anivibe_official" target="_blank">
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
                                        className={`season ${currentSeason?.id === season.id ? "current" : ""}`}
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
                                        style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}
                                        key={currentSeason.episodes[0].id}
                                        className="episode current film"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-film" viewBox="0 0 16 16">
                                            <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z" />
                                        </svg> Film
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3>Qismlar</h3>
                                    <div className="episodes">
                                        {currentSeason.episodes.map((ep) => (
                                            <div
                                                key={ep.id}
                                                className={`episode ${currentEpisode?.id === ep.id ? "current" : ""}`}
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
                    <div className="anime-titles" style={{ display: 'flex', flexDirection: 'column' }}>
                        {currentSeason && <h1 className="season-title">{anime.title} {currentSeason.title}</h1>}
                    </div>
                    <p>{anime.description}</p>
                    <div className="anime-meta">
                        <div className="meta-item">
                            <h3>Mamlakat</h3>
                            <p>{anime.countir || "Yaponiya"}</p>
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
            </div>
        </div>
    );
}
