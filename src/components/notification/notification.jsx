import React from 'react'
import './notification.scss'
import { Link } from 'react-router-dom'

const Notification = () => {
  const notifications = [
    {
      id: 1,
      type: 'comment',
      title: `Assalomu alaykum, Xurmatli foydalanuvchilar biz bilan ekanligingizdan bag'oyatda xursandmiz!`,
      message:``
    }
  ];

  return (
    <div className='notification'>
      <div className='overlay'></div>
      <div className='notification-content'>

        <h1>Xabarlar</h1>
        <div className='notification-container'>
          {notifications.length === 0 ? (
            <p>Yangi xabarlar yo'q</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className='notification-item'>
                <p>{notif.title}</p>
                <p>Bizning ijtimoiy-tarmoqlarimiz</p>
                <p>Telegram: <a href='https://t.me/anivibe_official' translate='_blank'>UZ-ANIME</a></p>
                <p>Xurmatli foydalanuvchi saytdagi muammolar yoki noqulayliklar to'g'risida bizga xabar bering: <a  href="https://t.me/anivibe_official" target='_blank'>Telegram</a> </p>
                {/* <p>{notif.message}</p> */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Notification
