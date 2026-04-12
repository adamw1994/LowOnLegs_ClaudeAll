using LowOnLegs.Core.Models;

namespace LowOnLegs.Core.DTOs
{
    public class DoubleMatchDto
    {
        public int DoubleMatchId { get; set; }
        public PlayerDto? LeftPlayer1 { get; set; }
        public PlayerDto? LeftPlayer2 { get; set; }
        public PlayerDto? RightPlayer1 { get; set; }
        public PlayerDto? RightPlayer2 { get; set; }
        public int LeftTeamScore { get; set; }
        public int RightTeamScore { get; set; }
        public bool? LeftTeamWon { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public bool IsFinished { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public bool HasAllPlayers =>
            LeftPlayer1 is not null && LeftPlayer2 is not null &&
            RightPlayer1 is not null && RightPlayer2 is not null;

        public DoubleMatch ToEntity() => new DoubleMatch
        {
            LeftPlayer1Id = LeftPlayer1?.Id,
            LeftPlayer2Id = LeftPlayer2?.Id,
            RightPlayer1Id = RightPlayer1?.Id,
            RightPlayer2Id = RightPlayer2?.Id,
            LeftTeamScore = LeftTeamScore,
            RightTeamScore = RightTeamScore,
            LeftTeamWon = LeftTeamWon,
            StartTime = StartTime,
            EndTime = EndTime,
            IsFinished = IsFinished,
            CreatedAt = CreatedAt,
            UpdatedAt = UpdatedAt
        };
    }
}
