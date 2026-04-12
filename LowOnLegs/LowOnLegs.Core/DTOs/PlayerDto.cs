using LowOnLegs.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        }
    }
}
