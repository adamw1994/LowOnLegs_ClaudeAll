namespace LowOnLegs.Core.Models
{
    public class Player
    {
        public int PlayerId { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? Nickname { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? ImagePath { get; set; }
        public int EloSingles { get; set; } = 1000;
        public int EloDoubles { get; set; } = 1000;

        public ICollection<Match>? Matches { get; set; }
        public ICollection<Match>? MatchesWon { get; set; }
    }
}
