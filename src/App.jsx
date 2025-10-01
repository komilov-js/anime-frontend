import React, { useContext } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import './App.css'
import Home from './pages/home/home'
import Login from './pages/registerLogin/login/login'
import Register from './pages/registerLogin/register/register'
import Nav from './components/nav/nav'
import AnimeDetail from './components/animeDetail/animeDetail'
import Profile from './pages/profile/profile'
import { AuthContext, AuthProvider } from './context/AuthContext'
import Footer from './components/footer/footer'
import CategoryPage from './pages/category/category'
import News from './components/news/news'
import Notification from './components/notification/notification'
import ScrollToTop from './components/scrollTop/scrollTop'
import NotFound from './pages/notFound/notFound'
import AdminDashboard from './pages/profile/animeDashboard/AdminDashboard'

const AppContext = () => {
  const { user } = useContext(AuthContext)

  return (
    <>
      <Nav />
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />

        {/* login/register sahifasini shartli render qilish */}
        {!user ? (
          <>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </>
        ) : (
          <>
            <Route path='/login' element={<Navigate to="/" replace />} />
            <Route path='/register' element={<Navigate to="/" replace />} />
          </>
        )}

        <Route path="/anime/:slug" element={<AnimeDetail />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/news" element={<News />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/admin" element={<AdminDashboard />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContext />
      </AuthProvider>
    </BrowserRouter>
  )
}
export default App
