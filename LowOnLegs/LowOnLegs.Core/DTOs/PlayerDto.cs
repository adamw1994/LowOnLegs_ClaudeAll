using LowOnLegs.Core.Models;

namespace LowOnLegs.Core.DTOs
{
    public class PlayerDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? Nickname { get; set; }
        public string? ImagePath { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int EloSingles { get; set; }
        public int EloDoubles { get; set; }

        public PlayerDto() { }

        public PlayerDto(Player player)
        {
            Id = player.PlayerId;
            Name = player.Name;
            Surname = player.Surname;
            Nickname = player.Nickname;
            Email = player.Email;
            Phone = player.Phone;
            DateOfBirth = player.DateOfBirth;
            CreatedAt = player.CreatedAt;
            UpdatedAt = player.UpdatedAt;
            ImagePath = player.ImagePath;
            EloSingles = player.EloSingles;
            EloDoubles = player.EloDoubles;
        }
    }
}
