import axios from 'axios'
import type { DoubleMatchHistory, DoubleMatchState, HeadToHead, MatchHistory, MatchState, Player } from '../types'

const api = axios.create({ baseURL: '/api' })

// Players
export const getPlayers = () => api.get<Player[]>('/players').then(r => r.data)
export const addPlayer = (formData: FormData) =>
  api.post<Player>('/players', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)

// Singles match
export const startMatch = () => api.post<MatchState>('/matches/start').then(r => r.data)
export const finishMatch = () => api.post<MatchState>('/matches/finish').then(r => r.data)
export const resetMatch = () => api.post<MatchState>('/matches/reset').then(r => r.data)
export const addPoint = (player: 'Left' | 'Right') =>
  api.post<MatchState>(`/matches/add-point?player=${player}`).then(r => r.data)
export const subtractPoint = (player: 'Left' | 'Right') =>
  api.post<MatchState>(`/matches/subtract-point?player=${player}`).then(r => r.data)
export const setLeftPlayer = (id: number) => api.post<MatchState>(`/matches/set-left-player/${id}`).then(r => r.data)
export const setRightPlayer = (id: number) => api.post<MatchState>(`/matches/set-right-player/${id}`).then(r => r.data)
export const getMatchHistory = () => api.get<MatchHistory[]>('/matches').then(r => r.data)

// Doubles match
export const startDoubleMatch = () => api.post<DoubleMatchState>('/doublematches/start').then(r => r.data)
export const finishDoubleMatch = () => api.post<DoubleMatchState>('/doublematches/finish').then(r => r.data)
export const resetDoubleMatch = () => api.post<DoubleMatchState>('/doublematches/reset').then(r => r.data)
export const addDoublePoint = (team: 'Left' | 'Right') =>
  api.post<DoubleMatchState>(`/doublematches/add-point?team=${team}`).then(r => r.data)
export const subtractDoublePoint = (team: 'Left' | 'Right') =>
  api.post<DoubleMatchState>(`/doublematches/subtract-point?team=${team}`).then(r => r.data)
export const setDoublePlayer = (position: number, playerId: number) =>
  api.post<DoubleMatchState>(`/doublematches/set-player/${position}/${playerId}`).then(r => r.data)
export const getDoubleMatchHistory = () => api.get<DoubleMatchHistory[]>('/doublematches').then(r => r.data)

// Stats
export const getSinglesElo = () => api.get<Player[]>('/stats/elo/singles').then(r => r.data)
export const getDoublesElo = () => api.get<Player[]>('/stats/elo/doubles').then(r => r.data)
export const getHeadToHead = () => api.get<HeadToHead[]>('/stats/head-to-head').then(r => r.data)
