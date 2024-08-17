import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/home/Home';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      {/* <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} /> */}
    </Routes>
  </BrowserRouter>
  )
}

export default App
