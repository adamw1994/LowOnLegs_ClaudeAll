import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  startMatch, finishMatch, resetMatch,
  addPoint, subtractPoint,
  setLeftPlayer, setRightPlayer,
  getPlayers,
} from '../services/api'
import type { MatchState, Player } from '../types'
import AvatarSelector from '../components/AvatarSelector'
import { useSignalR } from '../hooks/useSignalR'

export default function SingleScoreboard() {
  const { singleScore } = useSignalR()
  const { data: players = [] } = useQuery({ queryKey: ['players'], queryFn: getPlayers })
  const [state, setState] = useState<MatchState | null>(null)

  const isGameOver = (s: MatchState) =>
    (s.leftPlayerScore >= 11 || s.rightPlayerScore >= 11) &&
    Math.abs(s.leftPlayerScore - s.rightPlayerScore) >= 2

  useEffect(() => { startMatch().then(setState) }, [])

  useEffect(() => {
    if (singleScore && state) {
      setState(s => s ? { ...s, leftPlayerScore: singleScore.leftScore, rightPlayerScore: singleScore.rightScore } : s)
    }
  }, [singleScore])

  const mutate = (fn: () => Promise<MatchState>) => fn().then(setState)

  const gameOver = state ? isGameOver(state) : false
  const winner = gameOver
    ? (state!.leftPlayerScore > state!.rightPlayerScore ? state!.leftPlayer : state!.rightPlayer)
    : null

  const serverSide = state?.currentServer
  const isFightForServe = state?.currentServer === null && state?.leftPlayerScore === 0 && state?.rightPlayerScore === 0

  return (
    <div className="h-[calc(100vh-52px)] flex flex-col select-none" style={{ background: 'var(--bg-base)' }}>

      {/* Control bar */}
      <div
        className="flex items-center justify-center gap-3 px-6 py-2.5 border-b"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <button
          onClick={() => mutate(resetMatch)}
          className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95"
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'var(--bg-elevated)' }}
        >
          Reset
        </button>
        <button
          onClick={() => mutate(finishMatch)}
          className="px-4 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-medium border border-emerald-500/30 transition-all hover:scale-105 active:scale-95"
        >
          Zakończ mecz
        </button>
      </div>

      {/* Main scoreboard */}
      <div className="flex-1 flex items-stretch min-h-0">

        {/* LEFT */}
        <ScorePanel
          player={state?.leftPlayer ?? null}
          players={players}
          score={state?.leftPlayerScore ?? 0}
          isServer={serverSide === 'Left'}
          isWinner={!!winner && winner.id === state?.leftPlayer?.id}
          isGameOver={gameOver}
          onAdd={() => mutate(() => addPoint('Left'))}
          onSubtract={() => mutate(() => subtractPoint('Left'))}
          onSelectPlayer={p => mutate(() => setLeftPlayer(p.id))}
          isFightForServe={!!isFightForServe}
        />

        {/* Divider */}
        <div className="flex flex-col items-center justify-center w-12 shrink-0">
          <div className="w-px flex-1" style={{ background: 'var(--border)' }} />
          <span className="font-black text-3xl my-4" style={{ color: 'var(--text-faint)' }}>:</span>
          <div className="w-px flex-1" style={{ background: 'var(--border)' }} />
        </div>

        {/* RIGHT */}
        <ScorePanel
          player={state?.rightPlayer ?? null}
          players={players}
          score={state?.rightPlayerScore ?? 0}
          isServer={serverSide === 'Right'}
          isWinner={!!winner && winner.id === state?.rightPlayer?.id}
          isGameOver={gameOver}
          onAdd={() => mutate(() => addPoint('Right'))}
          onSubtract={() => mutate(() => subtractPoint('Right'))}
          onSelectPlayer={p => mutate(() => setRightPlayer(p.id))}
          isFightForServe={!!isFightForServe}
        />
      </div>

      {/* Fight for serve hint */}
      {isFightForServe && (
        <div className="text-center py-3 bg-amber-500/10 text-amber-400 text-sm border-t border-amber-500/20 font-medium">
          Kliknij po stronie gracza, który zaczyna serwis
        </div>
      )}
    </div>
  )
}

interface ScorePanelProps {
  player: Player | null
  players: Player[]
  score: number
  isServer: boolean
  isWinner: boolean
  isGameOver: boolean
  onAdd: () => void
  onSubtract: () => void
  onSelectPlayer: (p: Player) => void
  isFightForServe: boolean
}

function ScorePanel({
  player, players, score, isServer, isWinner, isGameOver, onAdd, onSubtract, onSelectPlayer, isFightForServe,
}: ScorePanelProps) {
  const dimmed = isGameOver && !isWinner

  return (
    <div
      className={`flex-1 flex flex-col items-center justify-between py-6 px-4 relative transition-opacity duration-500 ${dimmed ? 'opacity-25' : 'opacity-100'}`}
      onClick={isFightForServe ? onAdd : undefined}
      style={{ cursor: isFightForServe ? 'pointer' : 'default' }}
    >
      {/* Serving side — glowing top strip */}
      {isServer && (
        <div
          className="absolute inset-x-0 top-0 h-1 rounded-b-full"
          style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)', boxShadow: '0 0 20px 4px rgba(251,191,36,0.45)' }}
        />
      )}

      {/* Top badge — winner or serve label */}
      <div className="h-8 flex items-center justify-center">
        {isWinner && (
          <div className="bg-emerald-500/20 border border-emerald-500/35 text-emerald-400 font-bold text-xs tracking-widest uppercase px-5 py-1.5 rounded-full">
            Zwycięzca!
          </div>
        )}
        {isServer && !isWinner && (
          <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 font-semibold text-xs tracking-wider uppercase px-3 py-1.5 rounded-full">
            <span>●</span> Serwis
          </div>
        )}
      </div>

      {/* Player info — avatar is the selector */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <AvatarSelector players={players} selected={player} onSelect={onSelectPlayer} size="xl" />
        <div className="text-center">
          <div className="font-bold text-2xl tracking-wide" style={{ color: 'var(--text)' }}>
            {player?.nickname ?? '—'}
          </div>
          {player ? (
            <div className="text-sm mt-0.5" style={{ color: 'var(--text-faint)' }}>
              {player.name} {player.surname}
            </div>
          ) : (
            <div className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>
              kliknij zdjęcie by wybrać
            </div>
          )}
        </div>
      </div>

      {/* Score — giant number */}
      <div
        className="font-black leading-none tabular-nums"
        style={{
          fontSize: 'min(20vw, 30vh)',
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

      {/* Action buttons */}
      {!isGameOver && !isFightForServe && (
        <div className="flex items-center gap-5 pb-2">
          <button
            onClick={e => { e.stopPropagation(); onSubtract() }}
            className="w-14 h-14 rounded-full text-2xl font-bold transition-all hover:scale-110 active:scale-90"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            −
          </button>
          <button
            onClick={e => { e.stopPropagation(); onAdd() }}
            className="w-20 h-20 rounded-full text-3xl font-bold transition-all hover:scale-110 active:scale-90"
            style={{
              background: 'var(--accent-dim)',
              border: '2px solid var(--accent-border)',
              color: 'var(--accent)',
            }}
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}
