using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Models;

namespace LowOnLegs.Data.Repositories.Interfaces
{
    public interface IPlayerRepository
    {
        PlayerDto Get(int playerId);
        IEnumerable<PlayerDto> GetPlayers();
        Task<Player> Add(Player player);
        Task UpdateElo(int playerId, int eloSingles, int eloDoubles);
    }
}
