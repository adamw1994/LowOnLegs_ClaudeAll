import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private scoreSubject = new BehaviorSubject<{ player1: number; player2: number }>({ player1: 0, player2: 0 });

  score$ = this.scoreSubject.asObservable();

  constructor() {
    this.startConnection();
  }

  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/scoreboardhub`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected!');
        this.addScoreListener();
      })
      .catch(err => console.error('SignalR Error: ', err));
  }

  private addScoreListener() {
    this.hubConnection.on('UpdateScore', (score: { player1: number; player2: number }) => {
      console.log('Nowy wynik otrzymany:', score);
      this.scoreSubject.next(score);
    });
  }
}
