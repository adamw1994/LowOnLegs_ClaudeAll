using LowOnLegs.Core.Models;
using LowOnLegs.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LowOnLegs.Data.Repositories
{
    public class MatchRepository : IMatchRepository
    {
        private readonly ApplicationDbContext _context;

        public MatchRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Add(Match match)
        {
            try
            {
                await _context.Matches.AddAsync(match);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public IEnumerable<Match> GetAll()
        {
            return _context.Matches
                .Include(m => m.LeftPlayer)
                .Include(m => m.RightPlayer)
                .Include(m => m.Winner)
                .Where(m => m.IsFinished)
                .OrderByDescending(m => m.EndTime)
                .ToList();
        }
    }
}
