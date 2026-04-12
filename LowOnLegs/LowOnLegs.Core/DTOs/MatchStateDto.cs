using LowOnLegs.Core.Enums;
using LowOnLegs.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace LowOnLegs.Core.DTOs
{
    public class MatchStateDto
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

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public PlayerEnum? CurrentServer { get; set; }

        public MatchStateDto(MatchState matchState)
        {
            MatchId = matchState.MatchId;
            LeftPlayer = matchState.LeftPlayer;
            RightPlayer = matchState.RightPlayer;
            LeftPlayerScore = matchState.LeftPlayerScore;
            RightPlayerScore = matchState.RightPlayerScore;
            StartTime = matchState.StartTime;
            CreatedAt = matchState.CreatedAt;
            UpdatedAt = matchState.UpdatedAt;
            FirstServer = matchState.FirstServer;
            CurrentServer = matchState.CurrentServer;
        }

        public MatchDto ToMatchDto(MatchStateDto matchStateDto)
        {
            var matchDto =  new MatchDto
            {
                MatchId = matchStateDto.MatchId,
                LeftPlayer = matchStateDto.LeftPlayer,
                RightPlayer = matchStateDto.RightPlayer,
                LeftPlayerScore = matchStateDto.LeftPlayerScore,
                RightPlayerScore = matchStateDto.RightPlayerScore,
                StartTime = matchStateDto.StartTime,
                CreatedAt = matchStateDto.CreatedAt,
                UpdatedAt = matchStateDto.UpdatedAt,
                EndTime = DateTime.Now,
                IsFinished = true,
                FirstServer = matchStateDto.FirstServer,
            };

            if (!matchDto.SaveMatchToDatabase)
                return matchDto;

            if (matchStateDto.LeftPlayerScore > matchStateDto.RightPlayerScore)
            {
                matchDto.WinnerId = matchStateDto.LeftPlayer?.Id;
            }
            else if (matchStateDto.LeftPlayerScore < matchStateDto.RightPlayerScore)
            {
                matchDto.WinnerId = matchStateDto.RightPlayer?.Id;
            }
            return matchDto;
        }
    }
}
