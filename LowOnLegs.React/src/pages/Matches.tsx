import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMatchHistory, getDoubleMatchHistory } from '../services/api'
import PlayerAvatar from '../components/PlayerAvatar'

type Tab = 'singles' | 'doubles'

export default function Matches() {
  const [tab, setTab] = useState<Tab>('singles')

  const { data: singles = [], isLoading: loadingSingles } = useQuery({
    queryKey: ['matchHistory'],
    queryFn: getMatchHistory,
  })

  const { data: doubles = [], isLoading: loadingDoubles } = useQuery({
    queryKey: ['doubleMatchHistory'],
    queryFn: getDoubleMatchHistory,
  })

  const loading = tab === 'singles' ? loadingSingles : loadingDoubles

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Historia meczów</h1>

      <div className="flex gap-2 mb-6">
        {(['singles', 'doubles'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}>
            {t === 'singles' ? 'Singiel' : 'Debel'}
          </button>
        ))}
      </div>

      {loading && <div className="text-white/40 text-center py-12">Ładowanie...</div>}

      {tab === 'singles' && !loadingSingles && (
        <div className="flex flex-col gap-3">
          {singles.length === 0 && <EmptyState />}
          {singles.map(m => (
            <div key={m.matchId} className="bg-[#12121a] border border-white/10 rounded-xl px-6 py-4 flex items-center gap-6">
              {/* Left player */}
              <div className={`flex items-center gap-3 flex-1 ${m.winner?.id === m.leftPlayer?.id ? 'opacity-100' : 'opacity-50'}`}>
                <PlayerAvatar imagePath={m.leftPlayer?.imagePath ?? null} nickname={m.leftPlayer?.nickname ?? '?'} size="md" />
                <div>
                  <div className="text-white font-semibold">{m.leftPlayer?.nickname ?? '?'}</div>
                  {m.winner?.id === m.leftPlayer?.id && (
                    <div className="text-emerald-400 text-xs font-medium">Zwycięzca</div>
                  )}
                </div>
              </div>

              {/* Score */}
              <div className="flex items-center gap-3 font-black text-3xl text-white">
                <span className={m.winner?.id === m.leftPlayer?.id ? 'text-emerald-400' : ''}>{m.leftPlayerScore}</span>
                <span className="text-white/20 text-xl">:</span>
                <span className={m.winner?.id === m.rightPlayer?.id ? 'text-emerald-400' : ''}>{m.rightPlayerScore}</span>
              </div>

              {/* Right player */}
              <div className={`flex items-center gap-3 flex-1 justify-end ${m.winner?.id === m.rightPlayer?.id ? 'opacity-100' : 'opacity-50'}`}>
                <div className="text-right">
                  <div className="text-white font-semibold">{m.rightPlayer?.nickname ?? '?'}</div>
                  {m.winner?.id === m.rightPlayer?.id && (
                    <div className="text-emerald-400 text-xs font-medium">Zwycięzca</div>
                  )}
                </div>
                <PlayerAvatar imagePath={m.rightPlayer?.imagePath ?? null} nickname={m.rightPlayer?.nickname ?? '?'} size="md" />
              </div>

              {/* Date */}
              <div className="text-white/30 text-xs ml-4 shrink-0">
                {m.endTime ? new Date(m.endTime).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'doubles' && !loadingDoubles && (
        <div className="flex flex-col gap-3">
          {doubles.length === 0 && <EmptyState />}
          {doubles.map(m => (
            <div key={m.doubleMatchId} className="bg-[#12121a] border border-white/10 rounded-xl px-6 py-4">
              <div className="flex items-center gap-4">
                {/* Left team */}
                <div className={`flex items-center gap-2 flex-1 ${m.leftTeamWon ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="flex -space-x-2">
                    <PlayerAvatar imagePath={m.leftPlayer1?.imagePath ?? null} nickname={m.leftPlayer1?.nickname ?? '?'} size="sm" />
                    <PlayerAvatar imagePath={m.leftPlayer2?.imagePath ?? null} nickname={m.leftPlayer2?.nickname ?? '?'} size="sm" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{m.leftPlayer1?.nickname} & {m.leftPlayer2?.nickname}</div>
                    {m.leftTeamWon && <div className="text-emerald-400 text-xs">Zwycięzcy</div>}
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-3 font-black text-3xl text-white">
                  <span className={m.leftTeamWon ? 'text-emerald-400' : ''}>{m.leftTeamScore}</span>
                  <span className="text-white/20 text-xl">:</span>
                  <span className={!m.leftTeamWon ? 'text-emerald-400' : ''}>{m.rightTeamScore}</span>
                </div>

                {/* Right team */}
                <div className={`flex items-center gap-2 flex-1 justify-end ${!m.leftTeamWon ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="text-right">
                    <div className="text-white text-sm font-medium">{m.rightPlayer1?.nickname} & {m.rightPlayer2?.nickname}</div>
                    {!m.leftTeamWon && m.leftTeamWon !== null && <div className="text-emerald-400 text-xs">Zwycięzcy</div>}
                  </div>
                  <div className="flex -space-x-2">
                    <PlayerAvatar imagePath={m.rightPlayer1?.imagePath ?? null} nickname={m.rightPlayer1?.nickname ?? '?'} size="sm" />
                    <PlayerAvatar imagePath={m.rightPlayer2?.imagePath ?? null} nickname={m.rightPlayer2?.nickname ?? '?'} size="sm" />
                  </div>
                </div>
              </div>
              <div className="text-white/30 text-xs mt-2 text-right">
                {m.endTime ? new Date(m.endTime).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-white/30">
      <div className="text-4xl mb-3">🏓</div>
      <div>Brak rozegranych meczów</div>
    </div>
  )
}
