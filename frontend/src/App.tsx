import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<main className="container" style={{ padding: 24 }}>页面建设中…</main>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
