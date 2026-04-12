using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Enums;

namespace LowOnLegs.Core.Interfaces
{
    public interface IMatchService
    {
        MatchStateDto StartMatch(PlayerDto? player1 = null, PlayerDto? player2 = null);
        MatchStateDto FinishMatch();
        MatchStateDto ResetMatch();
        MatchStateDto AddPoint(PlayerEnum player);
        MatchStateDto SubtractPoint(PlayerEnum player);
        MatchStateDto SetLeftPlayer(PlayerDto player);
        MatchStateDto SetRightPlayer(PlayerDto player);
        IEnumerable<MatchHistoryDto> GetMatchHistory();
    }
}
