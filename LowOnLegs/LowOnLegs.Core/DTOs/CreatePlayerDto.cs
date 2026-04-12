namespace LowOnLegs.Core.DTOs
{
    public class CreatePlayerDto
    {
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? ImagePath { get; set; }
    }
}
