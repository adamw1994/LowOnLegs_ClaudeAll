import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  startMatch, finishMatch, resetMatch,
  addPoint, subtractPoint,
  setLeftPlayer, setRightPlayer,
  getPlayers,
} from '../services/api'
import type { MatchState, Player } from '../types'
import PlayerAvatar from '../components/PlayerAvatar'
import PlayerSelect from '../components/PlayerSelect'
import { useSignalR } from '../hooks/useSignalR'

export default function SingleScoreboard() {
  const { singleScore } = useSignalR()

  const { data: players = [] } = useQuery({ queryKey: ['players'], queryFn: getPlayers })

  const [state, setState] = useState<MatchState | null>(null)

  const isGameOver = (s: MatchState) =>
    (s.leftPlayerScore >= 11 || s.rightPlayerScore >= 11) &&
    Math.abs(s.leftPlayerScore - s.rightPlayerScore) >= 2

  useEffect(() => {
    startMatch().then(setState)
  }, [])

  // SignalR updates score in real-time from other clients
  useEffect(() => {
    if (singleScore && state) {
      setState(s => s ? { ...s, leftPlayerScore: singleScore.leftScore, rightPlayerScore: singleScore.rightScore } : s)
    }
  }, [singleScore])

  const mutate = (fn: () => Promise<MatchState>) => fn().then(setState)

  const winner = state && isGameOver(state)
    ? (state.leftPlayerScore > state.rightPlayerScore ? state.leftPlayer : state.rightPlayer)
    : null

  const serverSide = state?.currentServer

  return (
    <div className="h-[calc(100vh-52px)] flex flex-col bg-[#0a0a0f] select-none">

      {/* Player selection bar */}
      <div className="flex items-center justify-between px-8 py-3 bg-[#12121a] border-b border-white/10">
        <PlayerSelect
          players={players}
          selected={state?.leftPlayer ?? null}
          onSelect={p => mutate(() => setLeftPlayer(p.id))}
          label="Wybierz gracza L"
        />
        <div className="flex gap-3">
          <button
            onClick={() => mutate(resetMatch)}
            className="px-4 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/60 text-sm border border-white/10 transition-colors"
          >Reset</button>
          <button
            onClick={() => mutate(finishMatch)}
            className="px-4 py-1.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm border border-emerald-500/30 transition-colors"
          >Zakończ mecz</button>
        </div>
        <PlayerSelect
          players={players}
          selected={state?.rightPlayer ?? null}
          onSelect={p => mutate(() => setRightPlayer(p.id))}
          label="Wybierz gracza P"
        />
      </div>

      {/* Main scoreboard */}
      <div className="flex-1 flex items-stretch">

        {/* LEFT side */}
        <ScorePanel
          player={state?.leftPlayer ?? null}
          score={state?.leftPlayerScore ?? 0}
          isServer={serverSide === 'Left'}
          isWinner={winner?.id === state?.leftPlayer?.id}
          isGameOver={!!winner}
          onAdd={() => mutate(() => addPoint('Left'))}
          onSubtract={() => mutate(() => subtractPoint('Left'))}
          isFightForServe={state?.currentServer === null && state?.leftPlayerScore === 0 && state?.rightPlayerScore === 0}
        />

        {/* Divider */}
        <div className="flex flex-col items-center justify-center w-16 shrink-0">
          <div className="w-px flex-1 bg-white/5" />
          <span className="text-white/20 font-bold text-2xl my-4">:</span>
          <div className="w-px flex-1 bg-white/5" />
        </div>

        {/* RIGHT side */}
        <ScorePanel
          player={state?.rightPlayer ?? null}
          score={state?.rightPlayerScore ?? 0}
          isServer={serverSide === 'Right'}
          isWinner={winner?.id === state?.rightPlayer?.id}
          isGameOver={!!winner}
          onAdd={() => mutate(() => addPoint('Right'))}
          onSubtract={() => mutate(() => subtractPoint('Right'))}
          isFightForServe={state?.currentServer === null && state?.leftPlayerScore === 0 && state?.rightPlayerScore === 0}
        />
      </div>

      {/* Fight for serve hint */}
      {state && state.currentServer === null && state.leftPlayerScore === 0 && state.rightPlayerScore === 0 && (
        <div className="text-center py-3 bg-amber-500/10 text-amber-400 text-sm border-t border-amber-500/20">
          Kliknij po stronie gracza, który zaczyna serwis
        </div>
      )}
    </div>
  )
}

interface ScorePanelProps {
  player: Player | null
  score: number
  isServer: boolean
  isWinner: boolean
  isGameOver: boolean
  onAdd: () => void
  onSubtract: () => void
  isFightForServe: boolean
}

function ScorePanel({ player, score, isServer, isWinner, isGameOver, onAdd, onSubtract, isFightForServe }: ScorePanelProps) {
  const winnerGlow = isWinner ? 'shadow-[0_0_80px_rgba(52,211,153,0.3)]' : ''
  const loserDim = isGameOver && !isWinner ? 'opacity-40' : ''

  return (
    <div className={`flex-1 flex flex-col items-center justify-between py-6 px-4 relative cursor-pointer transition-all ${loserDim}`}
      onClick={isFightForServe ? onAdd : undefined}
    >
      {/* Serve indicator */}
      {isServer && (
        <div className="absolute top-4 text-amber-400 text-2xl animate-bounce">🏓</div>
      )}

      {/* Winner badge */}
      {isWinner && (
        <div className="absolute top-4 text-emerald-400 font-bold text-lg tracking-widest uppercase">
          Zwycięzca!
        </div>
      )}

      {/* Player info */}
      <div className="flex flex-col items-center gap-3 mt-8">
        <PlayerAvatar imagePath={player?.imagePath ?? null} nickname={player?.nickname ?? '?'} size="xl" />
        <span className="text-white font-bold text-3xl tracking-wide">
          {player?.nickname ?? '—'}
        </span>
        {player && (
          <span className="text-white/30 text-sm">{player.name} {player.surname}</span>
        )}
      </div>

      {/* Score — giant number */}
      <div className={`font-black text-[18vw] leading-none text-white ${winnerGlow} transition-all`}
        style={{ textShadow: isServer ? '0 0 40px rgba(251,191,36,0.4)' : undefined }}
      >
        {score}
      </div>

      {/* Buttons */}
      {!isGameOver && !isFightForServe && (
        <div className="flex gap-4 mb-2">
          <button
            onClick={e => { e.stopPropagation(); onSubtract() }}
            className="w-14 h-14 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 text-2xl transition-all"
          >−</button>
          <button
            onClick={e => { e.stopPropagation(); onAdd() }}
            className="w-20 h-20 rounded-full bg-emerald-500/10 hover:bg-emerald-500/25 border-2 border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 text-3xl font-bold transition-all shadow-lg"
          >+</button>
        </div>
      )}
    </div>
  )
}
