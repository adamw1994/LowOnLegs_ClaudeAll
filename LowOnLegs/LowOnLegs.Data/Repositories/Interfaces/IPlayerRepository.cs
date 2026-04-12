using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LowOnLegs.Data.Repositories.Interfaces
{
    public interface IPlayerRepository
    {
        public PlayerDto Get(int playerId);
        public IEnumerable<PlayerDto> GetPlayers();
    }
}
