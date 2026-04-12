using LowOnLegs.Core.Models;

namespace LowOnLegs.Data.Repositories.Interfaces
{
    public interface IMatchRepository
    {
        Task<bool> Add(Match match);
        IEnumerable<Match> GetAll();
    }
}
