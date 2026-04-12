using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Models;
using LowOnLegs.Data.Repositories.Interfaces;
using System.Threading.Tasks;

namespace LowOnLegs.Data.Repositories
{
    public class MatchRepository : IMatchRepository
    {
        private readonly ApplicationDbContext _context;

        public MatchRepository(ApplicationDbContext context) // 🔹 Wstrzykujemy kontekst przez konstruktor
        {
            _context = context;
        }

        public async Task<bool> Add(Match match)
        {
            try
            {
                await _context.Matches.AddAsync(match);
                await _context.SaveChangesAsync(); // 🔹 Zapisujemy zmiany
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }
    }
}
