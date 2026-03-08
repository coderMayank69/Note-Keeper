import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Note from './pages/Note'
import Notes from './pages/Notes'
import Navbar from './component/Navbar'
import Footer from './component/Footer'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="w-full flex-1">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/notes' element={<Notes />} />
          <Route path='/note/:id' element={<Note />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
