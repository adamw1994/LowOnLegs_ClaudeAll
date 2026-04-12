using LowOnLegs.Core.Models;

namespace LowOnLegs.Core.DTOs
{
    public class MatchHistoryDto
    {
        public int MatchId { get; set; }
        public PlayerDto? LeftPlayer { get; set; }
        public PlayerDto? RightPlayer { get; set; }
        public int LeftPlayerScore { get; set; }
        public int RightPlayerScore { get; set; }
        public PlayerDto? Winner { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }

        public MatchHistoryDto(Match match)
        {
            MatchId = match.MatchId;
            LeftPlayer = match.LeftPlayer != null ? new PlayerDto(match.LeftPlayer) : null;
            RightPlayer = match.RightPlayer != null ? new PlayerDto(match.RightPlayer) : null;
            Winner = match.Winner != null ? new PlayerDto(match.Winner) : null;
            LeftPlayerScore = match.Player1Score;
            RightPlayerScore = match.Player2Score;
            StartTime = match.StartTime;
            EndTime = match.EndTime;
        }
    }
}
