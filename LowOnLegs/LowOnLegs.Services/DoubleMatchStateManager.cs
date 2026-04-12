using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Interfaces;
using LowOnLegs.Core.Models;

namespace LowOnLegs.Services
{
    public class DoubleMatchStateManager : IDoubleMatchStateManager
    {
        private DoubleMatchState? _current;
        private readonly object _lock = new();

        public DoubleMatchStateDto StartMatch()
        {
            lock (_lock)
            {
                _current = new DoubleMatchState();
                return new DoubleMatchStateDto(_current);
            }
        }

        public DoubleMatchStateDto GetCurrentMatch()
        {
            lock (_lock)
            {
                if (_current is null) throw new InvalidOperationException("No doubles match in progress");
                return new DoubleMatchStateDto(_current);
            }
        }

        public DoubleMatchStateDto SetMatchState(DoubleMatchStateDto dto)
        {
            lock (_lock)
            {
                if (_current is null) throw new InvalidOperationException("No doubles match in progress");
                _current.LeftPlayer1 = dto.LeftPlayer1;
                _current.LeftPlayer2 = dto.LeftPlayer2;
                _current.RightPlayer1 = dto.RightPlayer1;
                _current.RightPlayer2 = dto.RightPlayer2;
                _current.LeftTeamScore = dto.LeftTeamScore;
                _current.RightTeamScore = dto.RightTeamScore;
                _current.FirstServer = dto.FirstServer;
                _current.CurrentServer = dto.CurrentServer;
                _current.UpdatedAt = DateTime.UtcNow;
                return new DoubleMatchStateDto(_current);
            }
        }
    }
}
