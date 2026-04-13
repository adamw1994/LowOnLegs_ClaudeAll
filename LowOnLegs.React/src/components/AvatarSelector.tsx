import { useState, useRef, useEffect } from 'react'
import type { Player } from '../types'
import PlayerAvatar from './PlayerAvatar'

interface Props {
  players: Player[]
  selected: Player | null
  onSelect: (p: Player) => void
  size?: 'lg' | 'xl'
}

export default function AvatarSelector({ players, selected, onSelect, size = 'xl' }: Props) {
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
      {/* Clickable avatar with hover overlay */}
      <div
        className="relative cursor-pointer group"
        onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
      >
        <PlayerAvatar imagePath={selected?.imagePath ?? null} nickname={selected?.nickname ?? '?'} size={size} />
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,0,0,0.55)' }}
        >
          <span className="text-white text-xs font-semibold tracking-wide">Zmień</span>
        </div>
        {/* ring indicator when no player selected */}
        {!selected && (
          <div className="absolute inset-0 rounded-full border-2 border-dashed animate-pulse" style={{ borderColor: 'var(--text-faint)' }} />
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 rounded-xl shadow-2xl z-50 min-w-[210px] py-1.5 max-h-64 overflow-y-auto"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-hover)' }}
        >
          {players.length === 0 && (
            <div className="px-4 py-3 text-sm" style={{ color: 'var(--text-faint)' }}>
              Brak graczy
            </div>
          )}
          {players.map(p => (
            <button
              key={p.id}
              onClick={e => { e.stopPropagation(); onSelect(p); setOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/5"
            >
              <PlayerAvatar imagePath={p.imagePath} nickname={p.nickname} size="sm" />
              <div className="text-left">
                <div
                  className="text-sm font-semibold"
                  style={{ color: selected?.id === p.id ? 'var(--accent)' : 'var(--text)' }}
                >
                  {p.nickname}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>
                  {p.name} {p.surname}
                </div>
              </div>
              {selected?.id === p.id && (
                <span className="ml-auto text-xs" style={{ color: 'var(--accent)' }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
