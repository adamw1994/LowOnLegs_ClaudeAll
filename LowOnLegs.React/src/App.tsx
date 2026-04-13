import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import SingleScoreboard from './pages/SingleScoreboard'
import DoubleScoreboard from './pages/DoubleScoreboard'
import Matches from './pages/Matches'
import Stats from './pages/Stats'
import Players from './pages/Players'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<SingleScoreboard />} />
              <Route path="doubles" element={<DoubleScoreboard />} />
              <Route path="matches" element={<Matches />} />
              <Route path="stats" element={<Stats />} />
              <Route path="players" element={<Players />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
