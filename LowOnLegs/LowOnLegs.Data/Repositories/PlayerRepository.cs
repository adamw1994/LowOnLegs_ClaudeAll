using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Models;
using LowOnLegs.Data.Repositories.Interfaces;

namespace LowOnLegs.Data.Repositories
{
    public class PlayerRepository : IPlayerRepository
    {
        private readonly ApplicationDbContext _context;

        public PlayerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public PlayerDto Get(int playerId)
        {
            var player = _context.Players.FirstOrDefault(p => p.PlayerId == playerId);
            return player != null ? new PlayerDto(player) : null!;
        }

        public IEnumerable<PlayerDto> GetPlayers()
        {
            return _context.Players.Select(p => new PlayerDto(p)).ToList();
        }

        public async Task<Player> Add(Player player)
        {
            player.CreatedAt = DateTime.UtcNow;
            player.UpdatedAt = DateTime.UtcNow;
            player.EloSingles = 1000;
            player.EloDoubles = 1000;
            _context.Players.Add(player);
            await _context.SaveChangesAsync();
            return player;
        }

        public async Task UpdateElo(int playerId, int eloSingles, int eloDoubles)
        {
            var player = _context.Players.FirstOrDefault(p => p.PlayerId == playerId);
            if (player is null) return;
            player.EloSingles = eloSingles;
            player.EloDoubles = eloDoubles;
            player.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }
}
