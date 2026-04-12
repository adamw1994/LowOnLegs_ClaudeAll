import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSinglesElo, getDoublesElo, getHeadToHead } from '../services/api'
import PlayerAvatar from '../components/PlayerAvatar'

type Tab = 'elo-singles' | 'elo-doubles' | 'h2h'

export default function Stats() {
  const [tab, setTab] = useState<Tab>('elo-singles')

  const { data: singlesElo = [] } = useQuery({ queryKey: ['singlesElo'], queryFn: getSinglesElo })
  const { data: doublesElo = [] } = useQuery({ queryKey: ['doublesElo'], queryFn: getDoublesElo })
  const { data: h2h = [] } = useQuery({ queryKey: ['headToHead'], queryFn: getHeadToHead })

  const tabs: { id: Tab; label: string }[] = [
    { id: 'elo-singles', label: 'ELO Singiel' },
    { id: 'elo-doubles', label: 'ELO Debel' },
    { id: 'h2h', label: 'Bilans 1v1' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Statystyki</h1>

      <div className="flex gap-2 mb-8">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {(tab === 'elo-singles' || tab === 'elo-doubles') && (
        <div className="flex flex-col gap-3">
          {(tab === 'elo-singles' ? singlesElo : doublesElo).map((p, i) => {
            const elo = tab === 'elo-singles' ? p.eloSingles : p.eloDoubles
            const maxElo = tab === 'elo-singles' ? singlesElo[0]?.eloSingles ?? 1000 : doublesElo[0]?.eloDoubles ?? 1000
            const pct = Math.round((elo / Math.max(maxElo, 1)) * 100)

            const medalColors = ['text-yellow-400', 'text-slate-300', 'text-amber-700']
            const medals = ['🥇', '🥈', '🥉']

            return (
              <div key={p.id} className="bg-[#12121a] border border-white/10 rounded-xl px-5 py-4 flex items-center gap-4">
                <div className={`w-8 text-center font-bold text-lg ${medalColors[i] ?? 'text-white/40'}`}>
                  {i < 3 ? medals[i] : `${i + 1}.`}
                </div>
                <PlayerAvatar imagePath={p.imagePath} nickname={p.nickname} size="md" />
                <div className="flex-1">
                  <div className="text-white font-semibold">{p.nickname}</div>
                  <div className="text-white/40 text-xs">{p.name} {p.surname}</div>
                  <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-black text-2xl">{elo}</div>
                  <div className="text-white/30 text-xs">ELO</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'h2h' && (
        <div className="flex flex-col gap-3">
          {h2h.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <div className="text-4xl mb-3">📊</div>
              <div>Za mało danych — rozegraj więcej meczów</div>
            </div>
          )}
          {h2h.map((entry, i) => (
            <div key={i} className="bg-[#12121a] border border-white/10 rounded-xl px-5 py-4">
              <div className="flex items-center gap-4">
                {/* Player 1 */}
                <div className={`flex items-center gap-2 flex-1 ${entry.player1Wins >= entry.player2Wins ? '' : 'opacity-50'}`}>
                  <PlayerAvatar imagePath={entry.player1.imagePath} nickname={entry.player1.nickname} size="md" />
                  <div>
                    <div className="text-white font-semibold">{entry.player1.nickname}</div>
                    <div className="text-white/40 text-xs">{entry.player1WinRate}% wygranych</div>
                  </div>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-3 font-black text-2xl">
                    <span className={entry.player1Wins > entry.player2Wins ? 'text-emerald-400' : 'text-white/60'}>{entry.player1Wins}</span>
                    <span className="text-white/20">:</span>
                    <span className={entry.player2Wins > entry.player1Wins ? 'text-emerald-400' : 'text-white/60'}>{entry.player2Wins}</span>
                  </div>
                  <div className="text-white/30 text-xs">{entry.totalMatches} {entry.totalMatches === 1 ? 'mecz' : 'meczów'}</div>
                  {/* Progress bar */}
                  <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500 transition-all" style={{ width: `${entry.player1WinRate}%` }} />
                    <div className="h-full bg-sky-500 transition-all flex-1" />
                  </div>
                </div>

                {/* Player 2 */}
                <div className={`flex items-center gap-2 flex-1 justify-end ${entry.player2Wins >= entry.player1Wins ? '' : 'opacity-50'}`}>
                  <div className="text-right">
                    <div className="text-white font-semibold">{entry.player2.nickname}</div>
                    <div className="text-white/40 text-xs">{entry.player2WinRate}% wygranych</div>
                  </div>
                  <PlayerAvatar imagePath={entry.player2.imagePath} nickname={entry.player2.nickname} size="md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
