using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Enums;
using LowOnLegs.Core.Interfaces;
using LowOnLegs.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LowOnLegs.Services
{
    public class MatchStateManager : IMatchStateManager
    {
        private MatchState? _currentMatch;
        private readonly object _lockObject = new object();

        public MatchStateDto GetMatchState() => new MatchStateDto(_currentMatch);

        public MatchStateDto StartMatch(PlayerDto? leftPlayer, PlayerDto? rightPlayer)
        {
            lock (_lockObject)
            {
                _currentMatch = new MatchState(leftPlayer, rightPlayer);
                return new MatchStateDto(_currentMatch);
            }
        }

        public MatchStateDto SetMatchState(MatchStateDto dto)
        {
            lock (_lockObject)
            {
                if (_currentMatch == null)
                {
                    throw new Exception("No match is currently in progress");
                }
                SetMatchStateFromDto(dto);

                return new MatchStateDto(_currentMatch);
            }
        }

        public MatchStateDto GetCurrentMatch()
        {
            lock (_lockObject)
            {
                if (_currentMatch is null)
                {
                    throw new Exception("No match is currently in progress");
                }

                return new MatchStateDto(_currentMatch);
            }
        }

        private void SetMatchStateFromDto(MatchStateDto dto)
        {
            _currentMatch.FirstServer = dto.FirstServer;
            _currentMatch.CurrentServer = dto.CurrentServer;
            _currentMatch.LeftPlayerScore = dto.LeftPlayerScore;
            _currentMatch.RightPlayerScore = dto.RightPlayerScore;
            _currentMatch.LeftPlayer = dto.LeftPlayer;
            _currentMatch.RightPlayer = dto.RightPlayer;
            _currentMatch.StartTime = dto.StartTime;
            _currentMatch.CreatedAt = dto.CreatedAt;
            _currentMatch.UpdatedAt = dto.UpdatedAt;
        }
    }

}
