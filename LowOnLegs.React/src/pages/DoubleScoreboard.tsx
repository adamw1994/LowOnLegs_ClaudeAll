import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  startDoubleMatch, finishDoubleMatch, resetDoubleMatch,
  addDoublePoint, subtractDoublePoint, setDoublePlayer, getPlayers,
} from '../services/api'
import type { DoubleMatchState, Player } from '../types'
import PlayerAvatar from '../components/PlayerAvatar'
import PlayerSelect from '../components/PlayerSelect'
import { useSignalR } from '../hooks/useSignalR'

export default function DoubleScoreboard() {
  const { doubleScore } = useSignalR()
  const [state, setState] = useState<DoubleMatchState | null>(null)
  const { data: players = [] } = useQuery({ queryKey: ['players'], queryFn: getPlayers })

  useEffect(() => { startDoubleMatch().then(setState) }, [])

  useEffect(() => {
    if (doubleScore && state) {
      setState(s => s ? { ...s, leftTeamScore: doubleScore.leftScore, rightTeamScore: doubleScore.rightScore } : s)
    }
  }, [doubleScore])

  const mutate = (fn: () => Promise<DoubleMatchState>) => fn().then(setState)

  const isGameOver = state
    ? (state.leftTeamScore >= 11 || state.rightTeamScore >= 11) &&
      Math.abs(state.leftTeamScore - state.rightTeamScore) >= 2
    : false

  const leftWon = isGameOver && state && state.leftTeamScore > state.rightTeamScore
  const rightWon = isGameOver && state && state.rightTeamScore > state.leftTeamScore
  const isFightForServe = state?.currentServer === null && state?.leftTeamScore === 0 && state?.rightTeamScore === 0

  return (
    <div className="h-[calc(100vh-52px)] flex flex-col bg-[#0a0a0f] select-none">

      {/* Control bar */}
      <div className="flex items-center justify-center gap-4 px-8 py-3 bg-[#12121a] border-b border-white/10">
        <button onClick={() => mutate(resetDoubleMatch)}
          className="px-4 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/60 text-sm border border-white/10 transition-colors">
          Reset
        </button>
        <button onClick={() => mutate(finishDoubleMatch)}
          className="px-4 py-1.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm border border-emerald-500/30 transition-colors">
          Zakończ mecz
        </button>
      </div>

      {/* Main area */}
      <div className="flex-1 flex items-stretch">

        {/* LEFT TEAM */}
        <TeamPanel
          player1={state?.leftPlayer1 ?? null}
          player2={state?.leftPlayer2 ?? null}
          score={state?.leftTeamScore ?? 0}
          isServer={state?.currentServer === 'Left'}
          isWinner={!!leftWon}
          isDimmed={!!rightWon}
          players={players}
          onSelectPlayer1={p => mutate(() => setDoublePlayer(1, p.id))}
          onSelectPlayer2={p => mutate(() => setDoublePlayer(2, p.id))}
          onAdd={() => mutate(() => addDoublePoint('Left'))}
          onSubtract={() => mutate(() => subtractDoublePoint('Left'))}
          onServeClick={isFightForServe ? () => mutate(() => addDoublePoint('Left')) : undefined}
        />

        {/* Divider */}
        <div className="flex flex-col items-center justify-center w-16 shrink-0">
          <div className="w-px flex-1 bg-white/5" />
          <span className="text-white/20 font-bold text-2xl my-4">:</span>
          <div className="w-px flex-1 bg-white/5" />
        </div>

        {/* RIGHT TEAM */}
        <TeamPanel
          player1={state?.rightPlayer1 ?? null}
          player2={state?.rightPlayer2 ?? null}
          score={state?.rightTeamScore ?? 0}
          isServer={state?.currentServer === 'Right'}
          isWinner={!!rightWon}
          isDimmed={!!leftWon}
          players={players}
          onSelectPlayer1={p => mutate(() => setDoublePlayer(3, p.id))}
          onSelectPlayer2={p => mutate(() => setDoublePlayer(4, p.id))}
          onAdd={() => mutate(() => addDoublePoint('Right'))}
          onSubtract={() => mutate(() => subtractDoublePoint('Right'))}
          onServeClick={isFightForServe ? () => mutate(() => addDoublePoint('Right')) : undefined}
        />
      </div>

      {isFightForServe && (
        <div className="text-center py-3 bg-amber-500/10 text-amber-400 text-sm border-t border-amber-500/20">
          Kliknij po stronie drużyny, która zaczyna serwis
        </div>
      )}
    </div>
  )
}

interface TeamPanelProps {
  player1: Player | null
  player2: Player | null
  score: number
  isServer: boolean
  isWinner: boolean
  isDimmed: boolean
  players: Player[]
  onSelectPlayer1: (p: Player) => void
  onSelectPlayer2: (p: Player) => void
  onAdd: () => void
  onSubtract: () => void
  onServeClick?: () => void
}

function TeamPanel({ player1, player2, score, isServer, isWinner, isDimmed, players, onSelectPlayer1, onSelectPlayer2, onAdd, onSubtract, onServeClick }: TeamPanelProps) {
  const isGameOver = isWinner || isDimmed
  return (
    <div
      className={`flex-1 flex flex-col items-center justify-between py-6 px-4 transition-all ${isDimmed ? 'opacity-40' : ''} ${onServeClick ? 'cursor-pointer' : ''}`}
      onClick={onServeClick}
    >
      {isServer && <div className="text-amber-400 text-2xl animate-bounce">🏓</div>}
      {isWinner && <div className="text-emerald-400 font-bold text-lg tracking-widest uppercase">Zwycięzcy!</div>}
      {!isServer && !isWinner && <div className="h-8" />}

      {/* Players */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-6 items-center">
          <div className="flex flex-col items-center gap-1">
            <PlayerAvatar imagePath={player1?.imagePath ?? null} nickname={player1?.nickname ?? '?'} size="lg" />
            <span className="text-white font-bold text-lg">{player1?.nickname ?? '—'}</span>
          </div>
          <span className="text-white/20 text-2xl">&</span>
          <div className="flex flex-col items-center gap-1">
            <PlayerAvatar imagePath={player2?.imagePath ?? null} nickname={player2?.nickname ?? '?'} size="lg" />
            <span className="text-white font-bold text-lg">{player2?.nickname ?? '—'}</span>
          </div>
        </div>
        {/* Player selects */}
        <div className="flex gap-2">
          <PlayerSelect players={players} selected={player1} onSelect={onSelectPlayer1} label="Gracz 1" />
          <PlayerSelect players={players} selected={player2} onSelect={onSelectPlayer2} label="Gracz 2" />
        </div>
      </div>

      {/* Score */}
      <div className={`font-black text-[16vw] leading-none text-white transition-all`}
        style={{ textShadow: isServer ? '0 0 40px rgba(251,191,36,0.4)' : undefined }}>
        {score}
      </div>

      {/* Buttons */}
      {!isGameOver && !onServeClick && (
        <div className="flex gap-4 mb-2">
          <button onClick={e => { e.stopPropagation(); onSubtract() }}
            className="w-14 h-14 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 text-2xl transition-all">−</button>
          <button onClick={e => { e.stopPropagation(); onAdd() }}
            className="w-20 h-20 rounded-full bg-emerald-500/10 hover:bg-emerald-500/25 border-2 border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 text-3xl font-bold transition-all">+</button>
        </div>
      )}
    </div>
  )
}
