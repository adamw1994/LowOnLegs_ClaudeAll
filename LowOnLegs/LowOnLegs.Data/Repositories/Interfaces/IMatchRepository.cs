using LowOnLegs.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LowOnLegs.Data.Repositories.Interfaces
{
    public interface IMatchRepository
    {
        public Task<bool> Add(Match match);
    }
}
