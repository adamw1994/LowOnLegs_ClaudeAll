import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSinglesElo, getDoublesElo, getHeadToHead, getMatchHistory } from '../services/api'
import type { HeadToHead, MatchHistory, Player } from '../types'
import PlayerAvatar from '../components/PlayerAvatar'

type Tab = 'elo-singles' | 'elo-doubles' | 'elo-k' | 'h2h' | 'stats'

// ── ELO re-calculation with arbitrary K ─────────────────────────────────────
function computeEloWithK(matches: MatchHistory[], players: Player[], K: number): Map<number, number> {
  const ratings = new Map<number, number>(players.map(p => [p.id, 1000]))
  const sorted = [...matches]
    .filter(m => m.leftPlayer && m.rightPlayer && m.winner)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  for (const m of sorted) {
    const idA = m.leftPlayer!.id
    const idB = m.rightPlayer!.id
    const rA = ratings.get(idA) ?? 1000
    const rB = ratings.get(idB) ?? 1000
    const ea = 1 / (1 + Math.pow(10, (rB - rA) / 400))
    const scoreA = m.winner!.id === idA ? 1 : 0
    ratings.set(idA, Math.round(rA + K * (scoreA - ea)))
    ratings.set(idB, Math.round(rB + K * ((1 - scoreA) - (1 - ea))))
  }
  return ratings
}

// ── Player stats from match history ─────────────────────────────────────────
interface PlayerStats {
  player: Player
  total: number
  wins: number
  losses: number
  winRate: number
  perfectWins: number     // 11-0 wins
  perfectLosses: number   // 0-11 losses
  avgScored: number       // avg points scored per match
  avgConceded: number     // avg points conceded per match
  longestStreak: number   // max consecutive wins
  biggestMargin: number   // biggest win score diff
  closestWin: number      // smallest margin in a win (e.g. 11-9 = 2)
}

function computePlayerStats(matches: MatchHistory[], players: Player[]): PlayerStats[] {
  return players
    .map(player => {
      const relevant = matches.filter(
        m => m.winner != null && (m.leftPlayer?.id === player.id || m.rightPlayer?.id === player.id)
      )
      if (relevant.length === 0) return null

      let wins = 0, losses = 0, perfectWins = 0, perfectLosses = 0
      let totalScored = 0, totalConceded = 0
      let curStreak = 0, longestStreak = 0, biggestMargin = 0, closestWin = 999

      for (const m of relevant) {
        const isLeft = m.leftPlayer?.id === player.id
        const myScore = isLeft ? m.leftPlayerScore : m.rightPlayerScore
        const oppScore = isLeft ? m.rightPlayerScore : m.leftPlayerScore
        const won = m.winner?.id === player.id

        totalScored += myScore
        totalConceded += oppScore

        if (won) {
          wins++
          curStreak++
          longestStreak = Math.max(longestStreak, curStreak)
          if (oppScore === 0) perfectWins++
          biggestMargin = Math.max(biggestMargin, myScore - oppScore)
          closestWin = Math.min(closestWin, myScore - oppScore)
        } else {
          losses++
          curStreak = 0
          if (myScore === 0) perfectLosses++
        }
      }

      return {
        player,
        total: relevant.length,
        wins,
        losses,
        winRate: Math.round((wins / relevant.length) * 100),
        perfectWins,
        perfectLosses,
        avgScored: Math.round((totalScored / relevant.length) * 10) / 10,
        avgConceded: Math.round((totalConceded / relevant.length) * 10) / 10,
        longestStreak,
        biggestMargin,
        closestWin: closestWin === 999 ? 0 : closestWin,
      } satisfies PlayerStats
    })
    .filter((s): s is PlayerStats => s !== null)
    .sort((a, b) => b.winRate - a.winRate || b.wins - a.wins)
}

// ── Components ───────────────────────────────────────────────────────────────

export default function Stats() {
  const [tab, setTab] = useState<Tab>('elo-singles')

  const { data: singlesElo = [] } = useQuery({ queryKey: ['singlesElo'], queryFn: getSinglesElo })
  const { data: doublesElo = [] } = useQuery({ queryKey: ['doublesElo'], queryFn: getDoublesElo })
  const { data: h2h = [] } = useQuery({ queryKey: ['headToHead'], queryFn: getHeadToHead })
  const { data: matchHistory = [] } = useQuery({ queryKey: ['matchHistory'], queryFn: getMatchHistory })

  const allPlayers = useMemo(() => {
    const map = new Map<number, Player>()
    singlesElo.forEach(p => map.set(p.id, p))
    return Array.from(map.values())
  }, [singlesElo])

  const kComparison = useMemo(() => {
    if (!allPlayers.length || !matchHistory.length) return []
    const k16 = computeEloWithK(matchHistory, allPlayers, 16)
    const k32 = computeEloWithK(matchHistory, allPlayers, 32)
    const k64 = computeEloWithK(matchHistory, allPlayers, 64)
    return allPlayers
      .map(p => ({ player: p, k16: k16.get(p.id) ?? 1000, k32: k32.get(p.id) ?? 1000, k64: k64.get(p.id) ?? 1000 }))
      .sort((a, b) => b.k32 - a.k32)
  }, [allPlayers, matchHistory])

  const playerStats = useMemo(() => computePlayerStats(matchHistory, allPlayers), [matchHistory, allPlayers])

  const tabs: { id: Tab; label: string }[] = [
    { id: 'elo-singles', label: 'ELO Singiel' },
    { id: 'elo-doubles', label: 'ELO Debel' },
    { id: 'elo-k', label: 'Porównanie K' },
    { id: 'h2h', label: 'Bilans 1v1' },
    { id: 'stats', label: 'Statystyki' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--text)' }}>Statystyki</h1>

      {/* Tab bar */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95"
            style={
              tab === t.id
                ? { background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }
                : { background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ELO ranking (singles or doubles) */}
      {(tab === 'elo-singles' || tab === 'elo-doubles') && (
        <EloRanking
          players={tab === 'elo-singles' ? singlesElo : doublesElo}
          getElo={p => tab === 'elo-singles' ? p.eloSingles : p.eloDoubles}
        />
      )}

      {/* K comparison */}
      {tab === 'elo-k' && <KComparison data={kComparison} />}

      {/* H2H matrix */}
      {tab === 'h2h' && <H2HView h2h={h2h} />}

      {/* Player stats */}
      {tab === 'stats' && <PlayerStatsView stats={playerStats} />}
    </div>
  )
}

// ── ELO Ranking ──────────────────────────────────────────────────────────────
function EloRanking({ players, getElo }: { players: Player[]; getElo: (p: Player) => number }) {
  const maxElo = getElo(players[0] ?? { eloSingles: 1000, eloDoubles: 1000 } as Player) || 1000
  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="flex flex-col gap-3">
      {players.map((p, i) => {
        const elo = getElo(p)
        const pct = Math.round((elo / maxElo) * 100)
        return (
          <div
            key={p.id}
            className="rounded-xl px-5 py-4 flex items-center gap-4"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <div className="w-8 text-center font-black text-lg">
              {i < 3 ? medals[i] : <span style={{ color: 'var(--text-faint)' }}>{i + 1}.</span>}
            </div>
            <PlayerAvatar imagePath={p.imagePath} nickname={p.nickname} size="md" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate" style={{ color: 'var(--text)' }}>{p.nickname}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{p.name} {p.surname}</div>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: 'var(--accent)' }}
                />
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-black text-2xl" style={{ color: 'var(--text)' }}>{elo}</div>
              <div className="text-xs" style={{ color: 'var(--text-faint)' }}>ELO</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── K Comparison ─────────────────────────────────────────────────────────────
function KComparison({ data }: { data: { player: Player; k16: number; k32: number; k64: number }[] }) {
  if (data.length === 0) {
    return <EmptyState icon="📊" text="Za mało danych — rozegraj więcej meczów" />
  }
  return (
    <div>
      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
        Porównanie rankingu ELO w zależności od współczynnika K. Wyższe K = większa zmienność ocen po każdym meczu.
      </p>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
              <th className="text-left px-4 py-3" style={{ color: 'var(--text-muted)' }}>Gracz</th>
              <th className="text-center px-4 py-3" style={{ color: 'var(--text-muted)' }}>K = 16</th>
              <th className="text-center px-4 py-3 font-black" style={{ color: 'var(--accent)' }}>K = 32 ✓</th>
              <th className="text-center px-4 py-3" style={{ color: 'var(--text-muted)' }}>K = 64</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={row.player.id}
                style={{
                  background: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-elevated)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <PlayerAvatar imagePath={row.player.imagePath} nickname={row.player.nickname} size="sm" />
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>{row.player.nickname}</span>
                  </div>
                </td>
                <EloCell value={row.k16} base={1000} />
                <EloCell value={row.k32} base={1000} highlight />
                <EloCell value={row.k64} base={1000} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EloCell({ value, base, highlight }: { value: number; base: number; highlight?: boolean }) {
  const diff = value - base
  const sign = diff >= 0 ? '+' : ''
  return (
    <td className="text-center px-4 py-3">
      <div className="font-black text-lg" style={{ color: highlight ? 'var(--accent)' : 'var(--text)' }}>
        {value}
      </div>
      <div
        className="text-xs"
        style={{ color: diff > 0 ? 'rgba(52,211,153,0.8)' : diff < 0 ? 'rgba(248,113,113,0.8)' : 'var(--text-faint)' }}
      >
        {sign}{diff}
      </div>
    </td>
  )
}

// ── H2H View ─────────────────────────────────────────────────────────────────
function H2HView({ h2h }: { h2h: HeadToHead[] }) {
  const [view, setView] = useState<'cards' | 'matrix'>('matrix')

  const playerMap = useMemo(() => {
    const m = new Map<number, Player>()
    h2h.forEach(e => { m.set(e.player1.id, e.player1); m.set(e.player2.id, e.player2) })
    return m
  }, [h2h])
  const players = Array.from(playerMap.values())

  const lookup = useMemo(() => {
    const m = new Map<string, { wins: number; losses: number }>()
    h2h.forEach(e => {
      m.set(`${e.player1.id}-${e.player2.id}`, { wins: e.player1Wins, losses: e.player2Wins })
      m.set(`${e.player2.id}-${e.player1.id}`, { wins: e.player2Wins, losses: e.player1Wins })
    })
    return m
  }, [h2h])

  if (h2h.length === 0) {
    return <EmptyState icon="⚔️" text="Za mało danych — rozegraj więcej meczów" />
  }

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {(['matrix', 'cards'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={
              view === v
                ? { background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }
                : { background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
            }
          >
            {v === 'matrix' ? 'Macierz' : 'Karty'}
          </button>
        ))}
      </div>

      {view === 'matrix' && (
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
          <table className="text-sm">
            <thead>
              <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
                <th className="px-4 py-3 text-left w-28" style={{ color: 'var(--text-muted)' }}>↓ vs →</th>
                {players.map(p => (
                  <th key={p.id} className="px-3 py-3 text-center min-w-[80px]">
                    <div className="flex flex-col items-center gap-1">
                      <PlayerAvatar imagePath={p.imagePath} nickname={p.nickname} size="sm" />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.nickname}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players.map((rowP, ri) => (
                <tr
                  key={rowP.id}
                  style={{ background: ri % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <PlayerAvatar imagePath={rowP.imagePath} nickname={rowP.nickname} size="sm" />
                      <span className="font-semibold text-xs" style={{ color: 'var(--text)' }}>{rowP.nickname}</span>
                    </div>
                  </td>
                  {players.map(colP => {
                    if (rowP.id === colP.id) {
                      return (
                        <td key={colP.id} className="px-3 py-3 text-center" style={{ color: 'var(--text-faint)' }}>
                          —
                        </td>
                      )
                    }
                    const d = lookup.get(`${rowP.id}-${colP.id}`)
                    if (!d) {
                      return (
                        <td key={colP.id} className="px-3 py-3 text-center" style={{ color: 'var(--text-faint)' }}>
                          –
                        </td>
                      )
                    }
                    const total = d.wins + d.losses
                    const pct = total > 0 ? d.wins / total : 0
                    const bg =
                      pct > 0.5
                        ? `rgba(52,211,153,${0.08 + pct * 0.18})`
                        : pct < 0.5
                        ? `rgba(248,113,113,${0.08 + (1 - pct) * 0.18})`
                        : 'var(--bg-surface)'
                    return (
                      <td key={colP.id} className="px-3 py-3 text-center rounded" style={{ background: bg }}>
                        <div className="font-black" style={{ color: 'var(--text)' }}>
                          {d.wins}:{d.losses}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{total}M</div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'cards' && (
        <div className="flex flex-col gap-3">
          {h2h.map((entry, i) => (
            <div
              key={i}
              className="rounded-xl px-5 py-4"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 flex-1 ${entry.player1Wins >= entry.player2Wins ? '' : 'opacity-50'}`}>
                  <PlayerAvatar imagePath={entry.player1.imagePath} nickname={entry.player1.nickname} size="md" />
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--text)' }}>{entry.player1.nickname}</div>
                    <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{entry.player1WinRate}% wygranych</div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-3 font-black text-2xl">
                    <span style={{ color: entry.player1Wins > entry.player2Wins ? 'var(--accent)' : 'var(--text-muted)' }}>
                      {entry.player1Wins}
                    </span>
                    <span style={{ color: 'var(--text-faint)' }}>:</span>
                    <span style={{ color: entry.player2Wins > entry.player1Wins ? 'var(--accent)' : 'var(--text-muted)' }}>
                      {entry.player2Wins}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-faint)' }}>
                    {entry.totalMatches} {entry.totalMatches === 1 ? 'mecz' : 'meczów'}
                  </div>
                  <div className="w-32 h-1.5 rounded-full overflow-hidden flex" style={{ background: 'var(--border)' }}>
                    <div className="h-full transition-all" style={{ width: `${entry.player1WinRate}%`, background: 'var(--accent)' }} />
                    <div className="h-full flex-1 bg-sky-500/60" />
                  </div>
                </div>

                <div className={`flex items-center gap-2 flex-1 justify-end ${entry.player2Wins >= entry.player1Wins ? '' : 'opacity-50'}`}>
                  <div className="text-right">
                    <div className="font-semibold" style={{ color: 'var(--text)' }}>{entry.player2.nickname}</div>
                    <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{entry.player2WinRate}% wygranych</div>
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

// ── Player Stats ─────────────────────────────────────────────────────────────
function PlayerStatsView({ stats }: { stats: PlayerStats[] }) {
  const [sortBy, setSortBy] = useState<keyof PlayerStats>('winRate')

  if (stats.length === 0) {
    return <EmptyState icon="🏆" text="Za mało danych — rozegraj więcej meczów" />
  }

  const sorted = [...stats].sort((a, b) => {
    const av = a[sortBy] as number
    const bv = b[sortBy] as number
    return bv - av
  })

  const sortOptions: { key: keyof PlayerStats; label: string }[] = [
    { key: 'winRate', label: 'Win %' },
    { key: 'wins', label: 'Zwycięstwa' },
    { key: 'total', label: 'Mecze' },
    { key: 'longestStreak', label: 'Seria' },
    { key: 'biggestMargin', label: 'Dominacja' },
    { key: 'avgScored', label: 'Śr. punkty' },
  ]

  return (
    <div>
      {/* Sort controls */}
      <div className="flex gap-2 flex-wrap mb-5">
        <span className="text-xs self-center mr-1" style={{ color: 'var(--text-faint)' }}>Sortuj:</span>
        {sortOptions.map(o => (
          <button
            key={String(o.key)}
            onClick={() => setSortBy(o.key)}
            className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
            style={
              sortBy === o.key
                ? { background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }
                : { background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
            }
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map(s => (
          <PlayerStatCard key={s.player.id} stat={s} />
        ))}
      </div>
    </div>
  )
}

function PlayerStatCard({ stat: s }: { stat: PlayerStats }) {
  return (
    <div
      className="rounded-xl px-5 py-4"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <PlayerAvatar imagePath={s.player.imagePath} nickname={s.player.nickname} size="md" />
        <div className="flex-1">
          <div className="font-bold" style={{ color: 'var(--text)' }}>{s.player.nickname}</div>
          <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{s.player.name} {s.player.surname}</div>
        </div>
        {/* Win rate badge */}
        <div
          className="text-right px-3 py-1 rounded-lg"
          style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}
        >
          <div className="font-black text-xl" style={{ color: 'var(--accent)' }}>{s.winRate}%</div>
          <div className="text-xs" style={{ color: 'var(--text-faint)' }}>win rate</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <StatCell label="Mecze" value={s.total} />
        <StatCell label="Wygrane" value={s.wins} color="rgba(52,211,153,0.9)" />
        <StatCell label="Przegrane" value={s.losses} color="rgba(248,113,113,0.8)" />
        <StatCell label="Seria" value={`${s.longestStreak}W`} title="Najdłuższa seria zwycięstw" />
        <StatCell label="Dominacja" value={`+${s.biggestMargin}`} title="Największa przewaga punktowa w wygranym meczu" />
        <StatCell label="Śr. zdobyte" value={s.avgScored} title="Średnia liczba punktów zdobytych w meczu" />
        <StatCell label="Śr. stracone" value={s.avgConceded} title="Średnia liczba punktów straconych w meczu" />
        <StatCell label="11-0 wins" value={s.perfectWins} color="rgba(251,191,36,0.9)" title="Mecze wygrane bez straty punktu" />
        <StatCell label="0-11 los" value={s.perfectLosses} color="rgba(248,113,113,0.7)" title="Mecze przegrane bez zdobycia punktu" />
      </div>

      {/* Win rate bar */}
      <div className="mt-3">
        <div className="h-1.5 rounded-full overflow-hidden flex" style={{ background: 'var(--border)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${s.winRate}%`, background: 'var(--accent)' }}
          />
        </div>
      </div>
    </div>
  )
}

function StatCell({ label, value, color, title }: { label: string; value: string | number; color?: string; title?: string }) {
  return (
    <div
      className="rounded-lg px-2 py-2 text-center"
      style={{ background: 'var(--bg-elevated)' }}
      title={title}
    >
      <div className="font-black text-base" style={{ color: color ?? 'var(--text)' }}>{value}</div>
      <div className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--text-faint)' }}>{label}</div>
    </div>
  )
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="text-center py-16" style={{ color: 'var(--text-faint)' }}>
      <div className="text-5xl mb-4">{icon}</div>
      <div className="text-sm">{text}</div>
    </div>
  )
}
