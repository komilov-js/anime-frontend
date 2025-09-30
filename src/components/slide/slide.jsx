import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./slide.scss";
import { Link } from "react-router-dom";
import { Autoplay } from "swiper/modules";
import '..//loading/loading.scss';


const Slide = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://komilov1.pythonanywhere.com/api/animes/")
      .then((response) => response.json())
      .then((json) => {
        // Agar backend json object yuborsa, results arrayni olamiz
        const animes = json.results || json;

        // Eng yangi 5 ta anime (id bo'yicha)
        const lastFive = animes
          .sort((a, b) => b.id - a.id) // eng yangi oldinga
          .slice(0, 5);

        setData(lastFive);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  if (!data || data.length === 0) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }


  return (
    <div>
      <Swiper
        key={data.length} // Swiper qayta render bo‘lishi uchun
        className="mySwiper"
        modules={[Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        observer={true}
        observeParents={true}
      >
        {data.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="overlay-swiper"></div>
            <div
              className="slide-bg"
              style={{
                backgroundImage: `url(${item.bg_image})`,
                backgroundSize: "cover",
                objectFit: "cover",
                backgroundPosition: "center",
                width: "100%",
                height: "90vh",
                position: "relative",
              }}
            >
              <div className="slide-content">
                <div className="slide-text">
                  <h1>{item.title}</h1>
                  <p>{item.description}</p>
                  <div className="hd-whatch">
                    <p style={{ fontSize: '20px' }}>{item.year || "2024"}</p>
                    <p id="HD">
                      1080 <span>FULL HD</span>
                    </p>
                    <Link to={`/anime/${item.slug}`}>
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="play"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="svg-inline--fa fa-play fa-w-14"
                      >
                        <path
                          fill="currentColor"
                          d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
                          className="svg"
                        ></path>
                      </svg>{" "}
                      Tomosha Qilish
                    </Link>
                  </div>
                </div>
                <div className="slide-img">
                  <img src={item.main_image} alt={item.title} />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slide;
