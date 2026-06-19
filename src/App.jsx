import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SiteProvider } from './context/SiteContext'
import Home from './pages/Home'
import Encyclopedie from './pages/Encyclopedie'
import Jeux from './pages/Jeux'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import HeroEditor from './pages/admin/HeroEditor'
import GamesEditor from './pages/admin/GamesEditor'
import TestimonialsEditor from './pages/admin/TestimonialsEditor'
import StatsEditor from './pages/admin/StatsEditor'
import Settings from './pages/admin/Settings'
import PuzzleAdmin from './pages/admin/PuzzleAdmin'
import EncyclopedieAdmin from './pages/admin/EncyclopedieAdmin'
import ApprendreWolof from './pages/ApprendreWolof'
import JeuPuzzle from './pages/games/JeuPuzzle'
import JeuMemoireWolof from './pages/games/JeuMemoireWolof'
import JeuCarte from './pages/games/JeuCarte'
import JeuCuisine from './pages/games/JeuCuisine'
import JeuMemoireCulture from './pages/games/JeuMemoireCulture'
import JeuContes from './pages/games/JeuContes'
import JeuQuiz from './pages/games/JeuQuiz'

export default function App() {
  return (
    <SiteProvider>
      <BrowserRouter>
        <Routes>
          {/* Pages publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/encyclopedie" element={<Encyclopedie />} />
          <Route path="/jeux" element={<Jeux />} />
          <Route path="/apprendre-wolof" element={<ApprendreWolof />} />
          <Route path="/jeux/puzzle" element={<JeuPuzzle />} />
          <Route path="/jeux/memoire-wolof" element={<JeuMemoireWolof />} />
          <Route path="/jeux/carte" element={<JeuCarte />} />
          <Route path="/jeux/cuisine" element={<JeuCuisine />} />
          <Route path="/jeux/memoire-culture" element={<JeuMemoireCulture />} />
          <Route path="/jeux/contes" element={<JeuContes />} />
          <Route path="/jeux/quiz" element={<JeuQuiz />} />

          {/* Admin — login sur /admin (index), panel sur /admin/xxx */}
          <Route path="/admin">
            <Route index element={<AdminLogin />} />
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="hero" element={<HeroEditor />} />
              <Route path="puzzles" element={<PuzzleAdmin />} />
              <Route path="encyclopedie" element={<EncyclopedieAdmin />} />
              <Route path="jeux" element={<GamesEditor />} />
              <Route path="temoignages" element={<TestimonialsEditor />} />
              <Route path="statistiques" element={<StatsEditor />} />
              <Route path="parametres" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </SiteProvider>
  )
}
