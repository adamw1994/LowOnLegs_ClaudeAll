using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LowOnLegs.Core.Interfaces
{
    public interface IPlayerService
    {
        public IEnumerable<PlayerDto> GetPlayers();
        public PlayerDto GetPlayer(int playerId);
    }
}
