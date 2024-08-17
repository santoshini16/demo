import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/home/Home';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/dashboard/Dashboard';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
