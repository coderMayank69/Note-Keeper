import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Note from './pages/Note'
import Notes from './pages/Notes'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/notes' element={<Notes />} />
      <Route path='/note/:id' element={<Note />} />
    </Routes>
  )
}

export default App
