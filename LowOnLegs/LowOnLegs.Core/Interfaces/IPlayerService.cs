using LowOnLegs.Core.DTOs;

namespace LowOnLegs.Core.Interfaces
{
    public interface IPlayerService
    {
        IEnumerable<PlayerDto> GetPlayers();
        PlayerDto GetPlayer(int playerId);
        Task<PlayerDto> AddPlayer(CreatePlayerDto dto);
    }
}
