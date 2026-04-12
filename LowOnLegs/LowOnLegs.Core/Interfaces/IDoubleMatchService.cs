using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Enums;

namespace LowOnLegs.Core.Interfaces
{
    public interface IDoubleMatchService
    {
        DoubleMatchStateDto StartMatch();
        DoubleMatchStateDto FinishMatch();
        DoubleMatchStateDto ResetMatch();
        DoubleMatchStateDto AddPoint(PlayerEnum team);
        DoubleMatchStateDto SubtractPoint(PlayerEnum team);
        DoubleMatchStateDto SetPlayer(int position, PlayerDto player);
        IEnumerable<DoubleMatchDto> GetMatchHistory();
    }
}
