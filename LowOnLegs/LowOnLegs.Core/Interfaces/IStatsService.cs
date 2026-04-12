using LowOnLegs.Core.DTOs;

namespace LowOnLegs.Core.Interfaces
{
    public interface IStatsService
    {
        IEnumerable<PlayerDto> GetSinglesEloRanking();
        IEnumerable<PlayerDto> GetDoublesEloRanking();
        IEnumerable<HeadToHeadDto> GetHeadToHead();
    }
}
