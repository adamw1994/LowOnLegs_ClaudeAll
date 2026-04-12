using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Enums;

namespace LowOnLegs.Core.Models
{
    public class DoubleMatchState
    {
        public int MatchId { get; set; }
        public PlayerDto? LeftPlayer1 { get; set; }
        public PlayerDto? LeftPlayer2 { get; set; }
        public PlayerDto? RightPlayer1 { get; set; }
        public PlayerDto? RightPlayer2 { get; set; }
        public int LeftTeamScore { get; set; }
        public int RightTeamScore { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public PlayerEnum? FirstServer { get; set; }
        public PlayerEnum? CurrentServer { get; set; }

        public DoubleMatchState()
        {
            StartTime = DateTime.UtcNow;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
            LeftTeamScore = 0;
            RightTeamScore = 0;
        }
    }
}
