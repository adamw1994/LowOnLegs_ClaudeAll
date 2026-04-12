using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Models;
using LowOnLegs.Data.Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace LowOnLegs.Data.Repositories
{
    public class PlayerRepository : IPlayerRepository
    {
        private readonly ApplicationDbContext _context;

        public PlayerRepository(ApplicationDbContext context) // 🔹 Wstrzykujemy kontekst
        {
            _context = context;
        }

        public PlayerDto Get(int playerId)
        {
            var player = _context.Players.FirstOrDefault(p => p.PlayerId == playerId);
            return player != null ? new PlayerDto(player) : null;
        }

        public IEnumerable<PlayerDto> GetPlayers()
        {
            return _context.Players.Select(p => new PlayerDto(p)).ToList();
        }
    }
}