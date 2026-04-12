import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatchStateDto } from '../../models/match-state-dto';
import { Player, PlayerEnum } from '../../models/player';
import { SignalRService } from '../../services/signalr.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './single-scoreboard.component.html',
  styleUrls: ['./single-scoreboard.component.scss']
})
export class SingleScoreboardComponent implements OnInit {
  PlayerEnum = PlayerEnum;
  players: Player[] = [];
  defaultPlayer: Player = {
    id: 0,
    name: "Default",
    surname: "Player",
    nickname: "Brak",
    imagePath: "assets/images/default-avatar.png",
    attribute: "Brak"
  };

  selectedPlayer1: Player | null = null;
  selectedPlayer2: Player | null = null;
  currentServer: PlayerEnum | string | null = null;
  score1 = 0;
  score2 = 0;

  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private signalRService: SignalRService) {}

  ngOnInit() {
    this.startMatch();
    this.loadPlayers().subscribe({
      next: (data) => {
        this.players = data;
        console.log("Pobrani gracze:", this.players);
      },
      error: (err) => console.error('Błąd pobierania graczy', err)
    });

    this.signalRService.score$.subscribe(newScore => {
      console.log('Aktualizacja wyniku z SignalR:', newScore);
      this.score1 = newScore.player1;
      this.score2 = newScore.player2;
    });
  }

  loadPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/api/Players`);
  }

  startMatch() {
    this.http.post<MatchStateDto>(`${this.apiUrl}/api/Matches/start`, {}).subscribe({
      next: (match) => {
        console.log("Mecz rozpoczęty:", match);
        this.score1 = match.leftPlayerScore;
        this.score2 = match.rightPlayerScore;
        this.selectedPlayer1 = match.leftPlayer || null;
        this.selectedPlayer2 = match.rightPlayer || null;
        this.currentServer = match.currentServer;
      },
      error: (err) => console.error("Błąd przy starcie meczu", err)
    });
  }

  increaseScore(player: PlayerEnum) {
    this.http.post<MatchStateDto>(`${this.apiUrl}/api/Matches/add-point?player=${player}`, {}).subscribe({
      next: (match) => {
        console.log("Aktualizacja meczu:", match);
        this.score1 = match.leftPlayerScore;
        this.score2 = match.rightPlayerScore;
        this.currentServer = match.currentServer;
      },
      error: (err) => console.error("Błąd przy dodawaniu punktu", err)
    });
  }

  decreaseScore(player: number) {
    this.http.post<MatchStateDto>(`${this.apiUrl}/api/Matches/subtract-point?player=${player}`, {}).subscribe({
      next: (match) => {
        console.log("Aktualizacja meczu:", match);
        this.score1 = match.leftPlayerScore;
        this.score2 = match.rightPlayerScore;
        this.currentServer = match.currentServer;
      },
      error: (err) => console.error("Błąd przy odejmowaniu punktu", err)
    });
  }

  resetScore() {
    this.http.post<MatchStateDto>(`${this.apiUrl}/api/Matches/reset`, {}).subscribe({
      next: (match) => {
        this.score1 = match.leftPlayerScore;
        this.score2 = match.rightPlayerScore;
        this.selectedPlayer1 = match.leftPlayer || null;
        this.selectedPlayer2 = match.rightPlayer || null;
        this.currentServer = match.currentServer;
      },
      error: (err) => console.error("Błąd przy resecie meczu", err)
    });
  }

  finishMatch() {
    this.http.post<MatchStateDto>(`${this.apiUrl}/api/Matches/finish`, {}).subscribe({
      next: (match) => {
        console.log("Mecz zakończony:", match);
        this.score1 = match.leftPlayerScore;
        this.score2 = match.rightPlayerScore;
        this.selectedPlayer1 = match.leftPlayer || null;
        this.selectedPlayer2 = match.rightPlayer || null;
        this.currentServer = match.currentServer;
      },
      error: (err) => console.error("Błąd przy kończeniu meczu", err)
    });
  }

  setPlayer(player: Player, playerNumber: number) {
    if (!player) return;

    const endpoint = playerNumber === 1 ? 'set-left-player' : 'set-right-player';
    this.http.post<MatchStateDto>(`${this.apiUrl}/api/Matches/${endpoint}/${player.id}`, {}).subscribe({
      next: (match) => {
        console.log(`Gracz ${playerNumber} ustawiony:`, match);
        if (playerNumber === 1) {
          this.selectedPlayer1 = match.leftPlayer || null;
        } else {
          this.selectedPlayer2 = match.rightPlayer || null;
        }
      },
      error: (err) => console.error(`Błąd ustawiania gracza ${playerNumber}`, err)
    });
  }
}
