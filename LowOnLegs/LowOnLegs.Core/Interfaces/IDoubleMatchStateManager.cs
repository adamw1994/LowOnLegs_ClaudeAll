using LowOnLegs.Core.DTOs;

namespace LowOnLegs.Core.Interfaces
{
    public interface IDoubleMatchStateManager
    {
        DoubleMatchStateDto GetCurrentMatch();
        DoubleMatchStateDto StartMatch();
        DoubleMatchStateDto SetMatchState(DoubleMatchStateDto dto);
    }
}
