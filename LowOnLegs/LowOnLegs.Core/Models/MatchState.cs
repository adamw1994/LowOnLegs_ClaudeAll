using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LowOnLegs.Core.Models
{
    public class MatchState
    {
        public int MatchId { get; set; }
        public PlayerDto? LeftPlayer { get; set; }
        public PlayerDto? RightPlayer { get; set; }
        public int LeftPlayerScore { get; set; }
        public int RightPlayerScore { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public PlayerEnum? FirstServer { get; set; }
        public PlayerEnum? CurrentServer { get; set; }

        public MatchState(PlayerDto? leftPlayer = null, PlayerDto? rightPlayer = null)
        {
            StartTime = DateTime.UtcNow;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
            LeftPlayerScore = 0;
            RightPlayerScore = 0;
            LeftPlayer = leftPlayer;
            RightPlayer = rightPlayer;
        }

        public MatchState(MatchStateDto dto)
        {
            StartTime = dto.StartTime;
            CreatedAt = dto.CreatedAt;
            UpdatedAt = dto.UpdatedAt;
            LeftPlayerScore = dto.LeftPlayerScore;
            RightPlayerScore = dto.RightPlayerScore;
            LeftPlayer = dto.LeftPlayer;
            RightPlayer = dto.RightPlayer;
            FirstServer = dto.FirstServer;
            CurrentServer = dto.CurrentServer;

        }
    }
}
