import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Anime = () => {
  const { slug } = useParams(); // URL: /anime/naruto
  const [anime, setAnime] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/animes/${slug}/`);
        const data = await res.json();
        setAnime(data);
      } catch (error) {
        console.error("Xato:", error);
      }
    };
    fetchAnime();
  }, [slug]);

  if (!anime) return <p>Yuklanmoqda...</p>;

  return (
    <>
      {/* Dinamik SEO */}
      <Helmet>
        <title>{anime.title} - O'zbekcha Anime</title>
        <meta name="description" content={anime.description} />
        <meta property="og:title" content={`${anime.title} - O'zbekcha Tilida`} />
        <meta property="og:description" content={anime.description} />
        <meta property="og:image" content={anime.main_image} />
        <meta
          property="og:url"
          content={`https://sizning-saytingiz.com/anime/${anime.slug}`}
        />
      </Helmet>

      {/* Kontent */}
      <h1>{anime.title}</h1>
      <img src={anime.image} alt={anime.title} />
      <p>{anime.description}</p>
    </>
  );
};

export default Anime;
