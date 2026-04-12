using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Interfaces;
using LowOnLegs.Core.Models;
using LowOnLegs.Data;
using LowOnLegs.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LowOnLegs.Services
{
    public class PlayerService : IPlayerService
    {
        private IPlayerRepository playerRepository;

        public PlayerService(IPlayerRepository playerRepository)
        {
            this.playerRepository = playerRepository;
        }

        public IEnumerable<PlayerDto> GetPlayers()
        {
            return playerRepository.GetPlayers();
        }

        public PlayerDto GetPlayer(int playerId)
        {
            return playerRepository.Get(playerId);
        }
    }
}
