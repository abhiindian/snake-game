import { Routes, Route } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { Game } from '@/pages/Game'

export function RoutesComponent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  )
}
