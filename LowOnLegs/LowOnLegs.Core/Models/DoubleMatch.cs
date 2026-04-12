namespace LowOnLegs.Core.Models
{
    public class DoubleMatch
    {
        public int DoubleMatchId { get; set; }
        public int? LeftPlayer1Id { get; set; }
        public int? LeftPlayer2Id { get; set; }
        public int? RightPlayer1Id { get; set; }
        public int? RightPlayer2Id { get; set; }
        public int LeftTeamScore { get; set; }
        public int RightTeamScore { get; set; }
        public bool? LeftTeamWon { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public bool IsFinished { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public Player? LeftPlayer1 { get; set; }
        public Player? LeftPlayer2 { get; set; }
        public Player? RightPlayer1 { get; set; }
        public Player? RightPlayer2 { get; set; }
    }
}
