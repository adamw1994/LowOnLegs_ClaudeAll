using LowOnLegs.Core.Enums;
using LowOnLegs.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LowOnLegs.Core.DTOs
{
    public class MatchDto
    {
        public int MatchId { get; set; }
        public PlayerDto? LeftPlayer { get; set; }
        public PlayerDto? RightPlayer { get; set; }
        public int LeftPlayerScore { get; set; }
        public int RightPlayerScore { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public bool IsFinished { get; set; }
        public int? WinnerId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool SaveMatchToDatabase => LeftPlayer is not null && RightPlayer is not null;
        public PlayerEnum? FirstServer { get; set; }

        public Match ToEntity()
        {
            return new Match
            {
                MatchId = this.MatchId,
                LeftPlayerId = this.LeftPlayer?.Id,
                RightPlayerId = this.RightPlayer?.Id,
                StartTime = this.StartTime,
                EndTime = this.EndTime,
                IsFinished = this.IsFinished,
                WinnerId = this.WinnerId,
                CreatedAt = this.CreatedAt,
                UpdatedAt = this.UpdatedAt,
                Player1Score = this.LeftPlayerScore,
                Player2Score = this.RightPlayerScore
            };
        }
    }
}
