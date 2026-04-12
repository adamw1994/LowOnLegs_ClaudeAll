import { Player } from "./player";
import { PlayerEnum } from "./player";

export interface MatchStateDto {
    leftPlayerScore: number;
    rightPlayerScore: number;
    leftPlayer: Player | null;
    rightPlayer: Player | null;
    currentServer: PlayerEnum;
  }
  