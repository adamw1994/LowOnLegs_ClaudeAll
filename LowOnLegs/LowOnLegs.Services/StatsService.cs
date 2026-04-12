using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Interfaces;
using LowOnLegs.Data.Repositories.Interfaces;

namespace LowOnLegs.Services
{
    public class StatsService : IStatsService
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly IMatchRepository _matchRepository;

        public StatsService(IPlayerRepository playerRepository, IMatchRepository matchRepository)
        {
            _playerRepository = playerRepository;
            _matchRepository = matchRepository;
        }

        public IEnumerable<PlayerDto> GetSinglesEloRanking()
        {
            return _playerRepository.GetPlayers()
                .OrderByDescending(p => p.EloSingles)
                .ToList();
        }

        public IEnumerable<PlayerDto> GetDoublesEloRanking()
        {
            return _playerRepository.GetPlayers()
                .OrderByDescending(p => p.EloDoubles)
                .ToList();
        }

        public IEnumerable<HeadToHeadDto> GetHeadToHead()
        {
            var players = _playerRepository.GetPlayers().ToList();
            var matches = _matchRepository.GetAll().ToList();
            var result = new List<HeadToHeadDto>();

            for (int i = 0; i < players.Count; i++)
            {
                for (int j = i + 1; j < players.Count; j++)
                {
                    var p1 = players[i];
                    var p2 = players[j];

                    var h2hMatches = matches.Where(m =>
                        (m.LeftPlayerId == p1.Id && m.RightPlayerId == p2.Id) ||
                        (m.LeftPlayerId == p2.Id && m.RightPlayerId == p1.Id)).ToList();

                    if (h2hMatches.Count == 0) continue;

                    int p1Wins = h2hMatches.Count(m => m.WinnerId == p1.Id);
                    int p2Wins = h2hMatches.Count(m => m.WinnerId == p2.Id);

                    result.Add(new HeadToHeadDto
                    {
                        Player1 = p1,
                        Player2 = p2,
                        Player1Wins = p1Wins,
                        Player2Wins = p2Wins
                    });
                }
            }

            return result.OrderByDescending(h => h.TotalMatches);
        }
    }
}
