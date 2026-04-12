using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Interfaces;
using LowOnLegs.Core.Models;
using LowOnLegs.Data.Repositories.Interfaces;

namespace LowOnLegs.Services
{
    public class PlayerService : IPlayerService
    {
        private readonly IPlayerRepository _playerRepository;

        public PlayerService(IPlayerRepository playerRepository)
        {
            _playerRepository = playerRepository;
        }

        public IEnumerable<PlayerDto> GetPlayers() => _playerRepository.GetPlayers();

        public PlayerDto GetPlayer(int playerId) => _playerRepository.Get(playerId);

        public async Task<PlayerDto> AddPlayer(CreatePlayerDto dto)
        {
            var player = new Player
            {
                Name = dto.Name,
                Surname = dto.Surname,
                Nickname = dto.Nickname,
                Email = dto.Email,
                Phone = dto.Phone,
                ImagePath = dto.ImagePath ?? "/images/default-avatar.png"
            };

            var saved = await _playerRepository.Add(player);
            return new PlayerDto(saved);
        }
    }
}
