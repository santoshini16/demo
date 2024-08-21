import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/home/Home';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/dashboard/Dashboard';
import Playquiz from './pages/playQuiz/Playquiz';
import Analytics from './pages/analytics/Analytics';
import QuestionWiseAnalysis from './pages/questionWiseAnalysis/QuestionWiseAnalysis';
//protected route should work
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/playquiz/:quizId" element={<Playquiz/>} />
      <Route path="/analytics" element={<Analytics/>} />
      <Route path="/questionwise/:quizId" element={<QuestionWiseAnalysis/>} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
