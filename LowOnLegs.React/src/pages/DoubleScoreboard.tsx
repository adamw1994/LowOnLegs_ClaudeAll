import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  startDoubleMatch, finishDoubleMatch, resetDoubleMatch,
  addDoublePoint, subtractDoublePoint, setDoublePlayer, getPlayers,
} from '../services/api'
import type { DoubleMatchState, Player } from '../types'
import AvatarSelector from '../components/AvatarSelector'
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

  const leftWon = isGameOver && !!state && state.leftTeamScore > state.rightTeamScore
  const rightWon = isGameOver && !!state && state.rightTeamScore > state.leftTeamScore
  const isFightForServe = state?.currentServer === null && state?.leftTeamScore === 0 && state?.rightTeamScore === 0

  return (
    <div className="h-[calc(100vh-52px)] flex flex-col select-none" style={{ background: 'var(--bg-base)' }}>

      {/* Control bar */}
      <div
        className="flex items-center justify-center gap-3 px-6 py-2.5 border-b"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <button
          onClick={() => mutate(resetDoubleMatch)}
          className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95"
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'var(--bg-elevated)' }}
        >
          Reset
        </button>
        <button
          onClick={() => mutate(finishDoubleMatch)}
          className="px-4 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-medium border border-emerald-500/30 transition-all hover:scale-105 active:scale-95"
        >
          Zakończ mecz
        </button>
      </div>

      {/* Main area */}
      <div className="flex-1 flex items-stretch min-h-0">

        {/* LEFT TEAM */}
        <TeamPanel
          player1={state?.leftPlayer1 ?? null}
          player2={state?.leftPlayer2 ?? null}
          score={state?.leftTeamScore ?? 0}
          isServer={state?.currentServer === 'Left'}
          isWinner={leftWon}
          isDimmed={rightWon}
          players={players}
          onSelectPlayer1={p => mutate(() => setDoublePlayer(1, p.id))}
          onSelectPlayer2={p => mutate(() => setDoublePlayer(2, p.id))}
          onAdd={() => mutate(() => addDoublePoint('Left'))}
          onSubtract={() => mutate(() => subtractDoublePoint('Left'))}
          onServeClick={isFightForServe ? () => mutate(() => addDoublePoint('Left')) : undefined}
        />

        {/* Divider */}
        <div className="flex flex-col items-center justify-center w-12 shrink-0">
          <div className="w-px flex-1" style={{ background: 'var(--border)' }} />
          <span className="font-black text-3xl my-4" style={{ color: 'var(--text-faint)' }}>:</span>
          <div className="w-px flex-1" style={{ background: 'var(--border)' }} />
        </div>

        {/* RIGHT TEAM */}
        <TeamPanel
          player1={state?.rightPlayer1 ?? null}
          player2={state?.rightPlayer2 ?? null}
          score={state?.rightTeamScore ?? 0}
          isServer={state?.currentServer === 'Right'}
          isWinner={rightWon}
          isDimmed={leftWon}
          players={players}
          onSelectPlayer1={p => mutate(() => setDoublePlayer(3, p.id))}
          onSelectPlayer2={p => mutate(() => setDoublePlayer(4, p.id))}
          onAdd={() => mutate(() => addDoublePoint('Right'))}
          onSubtract={() => mutate(() => subtractDoublePoint('Right'))}
          onServeClick={isFightForServe ? () => mutate(() => addDoublePoint('Right')) : undefined}
        />
      </div>

      {isFightForServe && (
        <div className="text-center py-3 bg-amber-500/10 text-amber-400 text-sm border-t border-amber-500/20 font-medium">
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

function TeamPanel({
  player1, player2, score, isServer, isWinner, isDimmed,
  players, onSelectPlayer1, onSelectPlayer2, onAdd, onSubtract, onServeClick,
}: TeamPanelProps) {
  const isGameOver = isWinner || isDimmed

  return (
    <div
      className={`flex-1 flex flex-col items-center justify-between py-6 px-4 relative transition-opacity duration-500 ${isDimmed ? 'opacity-25' : 'opacity-100'} ${onServeClick ? 'cursor-pointer' : ''}`}
      onClick={onServeClick}
    >
      {/* Serving strip */}
      {isServer && (
        <div
          className="absolute inset-x-0 top-0 h-1 rounded-b-full"
          style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)', boxShadow: '0 0 20px 4px rgba(251,191,36,0.45)' }}
        />
      )}

      {/* Top badge */}
      <div className="h-8 flex items-center justify-center">
        {isWinner && (
          <div className="bg-emerald-500/20 border border-emerald-500/35 text-emerald-400 font-bold text-xs tracking-widest uppercase px-5 py-1.5 rounded-full">
            Zwycięzcy!
          </div>
        )}
        {isServer && !isWinner && (
          <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 font-semibold text-xs tracking-wider uppercase px-3 py-1.5 rounded-full">
            <span>●</span> Serwis
          </div>
        )}
      </div>

      {/* Two players side by side — each avatar clickable */}
      <div className="flex items-center gap-3 mt-3">
        <div className="flex flex-col items-center gap-2" onClick={e => e.stopPropagation()}>
          <AvatarSelector players={players} selected={player1} onSelect={onSelectPlayer1} size="lg" />
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {player1?.nickname ?? '—'}
          </span>
        </div>

        <span className="text-2xl font-light mb-6" style={{ color: 'var(--text-faint)' }}>&</span>

        <div className="flex flex-col items-center gap-2" onClick={e => e.stopPropagation()}>
          <AvatarSelector players={players} selected={player2} onSelect={onSelectPlayer2} size="lg" />
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            {player2?.nickname ?? '—'}
          </span>
        </div>
      </div>

      {/* Score */}
      <div
        className="font-black leading-none tabular-nums"
        style={{
          fontSize: 'min(18vw, 28vh)',
          color: 'var(--text)',
          filter: isWinner
            ? 'drop-shadow(0 0 40px rgba(52,211,153,0.6))'
            : isServer
            ? 'drop-shadow(0 0 24px rgba(251,191,36,0.35))'
            : undefined,
        }}
      >
        {score}
      </div>

      {/* Buttons */}
      {!isGameOver && !onServeClick && (
        <div className="flex items-center gap-5 pb-2">
          <button
            onClick={e => { e.stopPropagation(); onSubtract() }}
            className="w-14 h-14 rounded-full text-2xl font-bold transition-all hover:scale-110 active:scale-90"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            −
          </button>
          <button
            onClick={e => { e.stopPropagation(); onAdd() }}
            className="w-20 h-20 rounded-full text-3xl font-bold transition-all hover:scale-110 active:scale-90"
            style={{ background: 'var(--accent-dim)', border: '2px solid var(--accent-border)', color: 'var(--accent)' }}
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}
