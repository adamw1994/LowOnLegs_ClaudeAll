import { useState, useRef, useEffect } from 'react'
import type { Player } from '../types'
import PlayerAvatar from './PlayerAvatar'

interface Props {
  players: Player[]
  selected: Player | null
  onSelect: (player: Player) => void
  label: string
}

export default function PlayerSelect({ players, selected, onSelect, label }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors min-w-[140px]"
      >
        {selected ? (
          <>
            <PlayerAvatar imagePath={selected.imagePath} nickname={selected.nickname} size="sm" />
            <span>{selected.nickname}</span>
          </>
        ) : (
          <span className="text-white/40">{label}</span>
        )}
        <span className="ml-auto text-white/30">▾</span>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl z-50 min-w-[180px] py-1">
          {players.map(p => (
            <button
              key={p.id}
              onClick={() => { onSelect(p); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 text-sm text-white/80 transition-colors"
            >
              <PlayerAvatar imagePath={p.imagePath} nickname={p.nickname} size="sm" />
              {p.nickname}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
