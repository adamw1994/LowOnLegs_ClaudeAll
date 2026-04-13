import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPlayers, addPlayer } from '../services/api'
import PlayerAvatar from '../components/PlayerAvatar'

export default function Players() {
  const qc = useQueryClient()
  const { data: players = [], isLoading } = useQuery({ queryKey: ['players'], queryFn: getPlayers })
  const [showForm, setShowForm] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ name: '', surname: '', nickname: '', email: '', phone: '' })

  const mutation = useMutation({
    mutationFn: (fd: FormData) => addPlayer(fd),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['players'] })
      setShowForm(false)
      setForm({ name: '', surname: '', nickname: '', email: '', phone: '' })
      setPreview(null)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('surname', form.surname)
    fd.append('nickname', form.nickname)
    if (form.email) fd.append('email', form.email)
    if (form.phone) fd.append('phone', form.phone)
    if (fileRef.current?.files?.[0]) fd.append('image', fileRef.current.files[0])
    mutation.mutate(fd)
  }

  const field = (placeholder: string, key: keyof typeof form, required = false) => (
    <input
      required={required}
      placeholder={placeholder}
      value={form[key]}
      onChange={e => setForm(s => ({ ...s, [key]: e.target.value }))}
      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
      style={{
        background: 'var(--bg-base)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
      }}
      onFocus={e => (e.target.style.borderColor = 'var(--accent-border)')}
      onBlur={e => (e.target.style.borderColor = 'var(--border)')}
    />
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Gracze</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-faint)' }}>
            {players.length} {players.length === 1 ? 'gracz' : 'graczy'} w bazie
          </p>
        </div>
        <button
          onClick={() => { setShowForm(s => !s); setPreview(null) }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={
            showForm
              ? { background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
              : { background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }
          }
        >
          {showForm ? '✕ Anuluj' : '+ Dodaj gracza'}
        </button>
      </div>

      {/* Add player form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 mb-8"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-base font-bold mb-5" style={{ color: 'var(--text)' }}>Nowy gracz</h2>

          {/* Photo + fields */}
          <div className="flex gap-6 items-start">
            {/* Photo picker */}
            <div
              className="shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
              onClick={() => fileRef.current?.click()}
            >
              <div className="relative">
                {preview ? (
                  <img src={preview} className="w-24 h-24 rounded-2xl object-cover" style={{ border: '2px solid var(--border)' }} />
                ) : (
                  <div
                    className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-1 transition-colors group-hover:border-opacity-50"
                    style={{ background: 'var(--bg-elevated)', border: '2px dashed var(--border)' }}
                  >
                    <span className="text-2xl">📷</span>
                    <span className="text-xs" style={{ color: 'var(--text-faint)' }}>Zdjęcie</span>
                  </div>
                )}
                <div
                  className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.5)' }}
                >
                  <span className="text-white text-xs font-semibold">Zmień</span>
                </div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) setPreview(URL.createObjectURL(f))
                }}
              />
            </div>

            {/* Fields grid */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              {field('Imię *', 'name', true)}
              {field('Nazwisko *', 'surname', true)}
              <div className="col-span-2">{field('Nick *', 'nickname', true)}</div>
              {field('Email', 'email')}
              {field('Telefon', 'phone')}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            {mutation.isError && (
              <span className="text-sm" style={{ color: 'rgba(248,113,113,0.9)' }}>Błąd podczas dodawania</span>
            )}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              {mutation.isPending ? 'Zapisywanie…' : 'Dodaj gracza'}
            </button>
          </div>
        </form>
      )}

      {/* Players grid */}
      {isLoading && (
        <div className="text-center py-16 text-sm" style={{ color: 'var(--text-faint)' }}>Ładowanie…</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {players.map(p => (
          <div
            key={p.id}
            className="rounded-2xl p-5 flex flex-col items-center gap-3 transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <PlayerAvatar imagePath={p.imagePath} nickname={p.nickname} size="lg" />

            <div className="text-center w-full">
              <div className="font-bold truncate" style={{ color: 'var(--text)' }}>{p.nickname}</div>
              <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-faint)' }}>
                {p.name} {p.surname}
              </div>
            </div>

            {/* ELO badges */}
            <div
              className="flex gap-2 w-full pt-3"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <div
                className="flex-1 rounded-lg py-1.5 text-center"
                style={{ background: 'var(--bg-elevated)' }}
                title="ELO Singiel"
              >
                <div className="text-xs font-black" style={{ color: 'var(--accent)' }}>{p.eloSingles}</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)', fontSize: '10px' }}>1v1</div>
              </div>
              <div
                className="flex-1 rounded-lg py-1.5 text-center"
                style={{ background: 'var(--bg-elevated)' }}
                title="ELO Debel"
              >
                <div className="text-xs font-black" style={{ color: 'rgba(96,165,250,0.9)' }}>{p.eloDoubles}</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)', fontSize: '10px' }}>2v2</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
