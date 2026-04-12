namespace LowOnLegs.Core.DTOs
{
    public class HeadToHeadDto
    {
        public PlayerDto Player1 { get; set; } = null!;
        public PlayerDto Player2 { get; set; } = null!;
        public int Player1Wins { get; set; }
        public int Player2Wins { get; set; }
        public int TotalMatches => Player1Wins + Player2Wins;
        public double Player1WinRate => TotalMatches == 0 ? 0 : Math.Round((double)Player1Wins / TotalMatches * 100, 1);
        public double Player2WinRate => TotalMatches == 0 ? 0 : Math.Round((double)Player2Wins / TotalMatches * 100, 1);
    }
}
