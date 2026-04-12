using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LowOnLegs.Core.Interfaces
{
    public interface IMatchStateManager
    {
        MatchStateDto GetCurrentMatch();
        MatchStateDto StartMatch(PlayerDto? player1 = null, PlayerDto? player2 = null);
        public MatchStateDto SetMatchState(MatchStateDto dto);

        public MatchStateDto GetMatchState();
    }
}
