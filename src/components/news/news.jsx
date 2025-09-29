import React from 'react'
import './news.scss'

const News = () => {
  const news = [
    {
      id: 1,
      title: "2024-YIL KUZ FASLIDA CHIQADIGAN ANIMELAR HAQIDA UMUMIY MA'LUMOT ( H.U.M. )",
      content: "Ushbu videoda ko‘rsatilgan barcha animelarni Aniblauz ilovalarida tomosha qilishingiz mumkin!",
      video: "https://www.youtube.com/embed/yE35HpSfcoc?si=FaJ3rqzRBWSaUjo_"
    }
  ]

  return (
    <div className='news'>
      <div className="overlay"></div>
      <div className='news-container'>
        {news.map(item => (
          <React.Fragment key={item.id}>
            {/* Chap taraf - matn */}
            <div className="news-text">
              <h1>Yangilik</h1>
              <h2>{item.title}</h2>
              <p>{item.content}</p>
            </div>

            {/* O‘ng taraf - video */}
            <div className="news-video">
              <iframe
                src={item.video}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default News
