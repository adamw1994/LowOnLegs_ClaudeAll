export interface Player {
  id: number
  name: string
  surname: string
  nickname: string
  imagePath: string | null
  email: string | null
  phone: string | null
  eloSingles: number
  eloDoubles: number
}

export type PlayerSide = 'Left' | 'Right'

export interface MatchState {
  matchId: number
  leftPlayer: Player | null
  rightPlayer: Player | null
  leftPlayerScore: number
  rightPlayerScore: number
  startTime: string
  currentServer: PlayerSide | null
  firstServer: PlayerSide | null
}

export interface DoubleMatchState {
  matchId: number
  leftPlayer1: Player | null
  leftPlayer2: Player | null
  rightPlayer1: Player | null
  rightPlayer2: Player | null
  leftTeamScore: number
  rightTeamScore: number
  startTime: string
  currentServer: PlayerSide | null
  firstServer: PlayerSide | null
}

export interface MatchHistory {
  matchId: number
  leftPlayer: Player | null
  rightPlayer: Player | null
  leftPlayerScore: number
  rightPlayerScore: number
  winner: Player | null
  startTime: string
  endTime: string | null
}

export interface DoubleMatchHistory {
  doubleMatchId: number
  leftPlayer1: Player | null
  leftPlayer2: Player | null
  rightPlayer1: Player | null
  rightPlayer2: Player | null
  leftTeamScore: number
  rightTeamScore: number
  leftTeamWon: boolean | null
  startTime: string
  endTime: string | null
}

export interface HeadToHead {
  player1: Player
  player2: Player
  player1Wins: number
  player2Wins: number
  totalMatches: number
  player1WinRate: number
  player2WinRate: number
}
