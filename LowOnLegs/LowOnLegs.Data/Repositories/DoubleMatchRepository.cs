using LowOnLegs.Core.Models;
using LowOnLegs.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LowOnLegs.Data.Repositories
{
    public class DoubleMatchRepository : IDoubleMatchRepository
    {
        private readonly ApplicationDbContext _context;

        public DoubleMatchRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Add(DoubleMatch match)
        {
            try
            {
                await _context.DoubleMatches.AddAsync(match);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public IEnumerable<DoubleMatch> GetAll()
        {
            return _context.DoubleMatches
                .Include(m => m.LeftPlayer1)
                .Include(m => m.LeftPlayer2)
                .Include(m => m.RightPlayer1)
                .Include(m => m.RightPlayer2)
                .Where(m => m.IsFinished)
                .OrderByDescending(m => m.EndTime)
                .ToList();
        }
    }
}
