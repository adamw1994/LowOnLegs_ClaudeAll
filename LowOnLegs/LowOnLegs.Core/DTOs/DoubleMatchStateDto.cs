using LowOnLegs.Core.Enums;
using LowOnLegs.Core.Models;
using System.Text.Json.Serialization;

namespace LowOnLegs.Core.DTOs
{
    public class DoubleMatchStateDto
    {
        public int MatchId { get; set; }
        public PlayerDto? LeftPlayer1 { get; set; }
        public PlayerDto? LeftPlayer2 { get; set; }
        public PlayerDto? RightPlayer1 { get; set; }
        public PlayerDto? RightPlayer2 { get; set; }
        public int LeftTeamScore { get; set; }
        public int RightTeamScore { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public PlayerEnum? FirstServer { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public PlayerEnum? CurrentServer { get; set; }

        public DoubleMatchStateDto() { }

        public DoubleMatchStateDto(DoubleMatchState state)
        {
            MatchId = state.MatchId;
            LeftPlayer1 = state.LeftPlayer1;
            LeftPlayer2 = state.LeftPlayer2;
            RightPlayer1 = state.RightPlayer1;
            RightPlayer2 = state.RightPlayer2;
            LeftTeamScore = state.LeftTeamScore;
            RightTeamScore = state.RightTeamScore;
            StartTime = state.StartTime;
            CreatedAt = state.CreatedAt;
            UpdatedAt = state.UpdatedAt;
            FirstServer = state.FirstServer;
            CurrentServer = state.CurrentServer;
        }
    }
}
