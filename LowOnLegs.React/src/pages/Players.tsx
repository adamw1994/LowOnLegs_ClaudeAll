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

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Gracze</h1>
        <button
          onClick={() => setShowForm(s => !s)}
          className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm border border-emerald-500/30 font-medium transition-colors"
        >
          {showForm ? 'Anuluj' : '+ Dodaj gracza'}
        </button>
      </div>

      {/* Add player form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#12121a] border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Nowy gracz</h2>
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Imię *" value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50" />
            <input required placeholder="Nazwisko *" value={form.surname} onChange={e => setForm(s => ({ ...s, surname: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50" />
            <input required placeholder="Nick *" value={form.nickname} onChange={e => setForm(s => ({ ...s, nickname: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50" />
            <input placeholder="Email" value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50" />
            <input placeholder="Telefon" value={form.phone} onChange={e => setForm(s => ({ ...s, phone: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-emerald-500/50" />

            {/* Photo upload */}
            <div className="flex items-center gap-3">
              {preview ? (
                <img src={preview} className="w-12 h-12 rounded-full object-cover border-2 border-white/20" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center text-white/30 text-xl">📷</div>
              )}
              <button type="button" onClick={() => fileRef.current?.click()}
                className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-sm transition-colors">
                Wybierz zdjęcie
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) setPreview(URL.createObjectURL(f))
                }} />
            </div>
          </div>

          <div className="flex justify-end mt-4 gap-3">
            {mutation.isError && <span className="text-red-400 text-sm self-center">Błąd podczas dodawania</span>}
            <button type="submit" disabled={mutation.isPending}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors disabled:opacity-50">
              {mutation.isPending ? 'Zapisywanie...' : 'Dodaj gracza'}
            </button>
          </div>
        </form>
      )}

      {/* Players grid */}
      {isLoading && <div className="text-white/40 text-center py-12">Ładowanie...</div>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {players.map(p => (
          <div key={p.id} className="bg-[#12121a] border border-white/10 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-white/20 transition-colors">
            <PlayerAvatar imagePath={p.imagePath} nickname={p.nickname} size="lg" />
            <div className="text-center">
              <div className="text-white font-bold">{p.nickname}</div>
              <div className="text-white/40 text-xs">{p.name} {p.surname}</div>
            </div>
            <div className="flex gap-3 text-xs text-white/40 w-full justify-center border-t border-white/5 pt-2">
              <span title="ELO Singiel">🏓 {p.eloSingles}</span>
              <span title="ELO Debel">👥 {p.eloDoubles}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
