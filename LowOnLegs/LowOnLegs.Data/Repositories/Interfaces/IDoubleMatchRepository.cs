using LowOnLegs.Core.Models;

namespace LowOnLegs.Data.Repositories.Interfaces
{
    public interface IDoubleMatchRepository
    {
        Task<bool> Add(DoubleMatch match);
        IEnumerable<DoubleMatch> GetAll();
    }
}
