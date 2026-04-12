using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        // Navigational properties
        public ICollection<Match>? Matches { get; set; }
        public ICollection<Match>? MatchesWon { get; set; }
    }
}
