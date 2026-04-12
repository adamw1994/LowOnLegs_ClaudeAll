using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LowOnLegs.Core.Models
{
    public class Match
    {
        public int MatchId { get; set; }
        public int? LeftPlayerId { get; set; }
        public int? RightPlayerId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public bool IsFinished { get; set; }
        public int? WinnerId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int Player1Score { get; set; }
        public int Player2Score { get; set; }

        // Navigational properties
        public Player? LeftPlayer { get; set; }
        public Player? RightPlayer { get; set; }
        public Player? Winner { get; set; }
    }
}
