import React from 'react'
import { Link } from 'react-router-dom'
import './notfound.scss'

const NotFound = () => {
  return (
    <div className='notfound'>
        <div className='notfound-content'>
            <h1>404 - Sahifa topilmadi</h1>
            <p>Kechirasiz, siz izlayotgan sahifa mavjud emas.</p>
            <Link to='/'>Bosh saxifaga qaytish</Link>
        </div>
    </div>
  )
}

export default NotFound