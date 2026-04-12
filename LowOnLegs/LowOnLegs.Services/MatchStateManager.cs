using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Interfaces;
using LowOnLegs.Core.Models;

namespace LowOnLegs.Services
{
    public class MatchStateManager : IMatchStateManager
    {
        private MatchState? _currentMatch;
        private readonly object _lock = new();

        public MatchStateDto GetMatchState() => new MatchStateDto(_currentMatch!);

        public MatchStateDto StartMatch(PlayerDto? leftPlayer = null, PlayerDto? rightPlayer = null)
        {
            lock (_lock)
            {
                _currentMatch = new MatchState(leftPlayer, rightPlayer);
                return new MatchStateDto(_currentMatch);
            }
        }

        public MatchStateDto SetMatchState(MatchStateDto dto)
        {
            lock (_lock)
            {
                if (_currentMatch is null) throw new InvalidOperationException("No match in progress");
                _currentMatch.FirstServer = dto.FirstServer;
                _currentMatch.CurrentServer = dto.CurrentServer;
                _currentMatch.LeftPlayerScore = dto.LeftPlayerScore;
                _currentMatch.RightPlayerScore = dto.RightPlayerScore;
                _currentMatch.LeftPlayer = dto.LeftPlayer;
                _currentMatch.RightPlayer = dto.RightPlayer;
                _currentMatch.StartTime = dto.StartTime;
                _currentMatch.CreatedAt = dto.CreatedAt;
                _currentMatch.UpdatedAt = dto.UpdatedAt;
                return new MatchStateDto(_currentMatch);
            }
        }

        public MatchStateDto GetCurrentMatch()
        {
            lock (_lock)
            {
                if (_currentMatch is null) throw new InvalidOperationException("No match in progress");
                return new MatchStateDto(_currentMatch);
            }
        }
    }
}
