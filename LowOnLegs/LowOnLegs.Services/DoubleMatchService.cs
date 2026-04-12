using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Enums;
using LowOnLegs.Core.Interfaces;
using LowOnLegs.Core.Models;
using LowOnLegs.Data.Repositories.Interfaces;

namespace LowOnLegs.Services
{
    public class DoubleMatchService : IDoubleMatchService
    {
        private readonly IDoubleMatchRepository _repository;
        private readonly IDoubleMatchStateManager _stateManager;
        private readonly IPlayerRepository _playerRepository;

        public DoubleMatchService(IDoubleMatchRepository repository, IDoubleMatchStateManager stateManager, IPlayerRepository playerRepository)
        {
            _repository = repository;
            _stateManager = stateManager;
            _playerRepository = playerRepository;
        }

        public DoubleMatchStateDto StartMatch() => _stateManager.StartMatch();

        public DoubleMatchStateDto FinishMatch()
        {
            var state = _stateManager.GetCurrentMatch();

            if (state.LeftPlayer1 is not null && state.LeftPlayer2 is not null &&
                state.RightPlayer1 is not null && state.RightPlayer2 is not null)
            {
                bool leftWon = state.LeftTeamScore > state.RightTeamScore;
                var entity = new DoubleMatch
                {
                    LeftPlayer1Id = state.LeftPlayer1.Id,
                    LeftPlayer2Id = state.LeftPlayer2.Id,
                    RightPlayer1Id = state.RightPlayer1.Id,
                    RightPlayer2Id = state.RightPlayer2.Id,
                    LeftTeamScore = state.LeftTeamScore,
                    RightTeamScore = state.RightTeamScore,
                    LeftTeamWon = leftWon,
                    StartTime = state.StartTime,
                    EndTime = DateTime.UtcNow,
                    IsFinished = true,
                    CreatedAt = state.CreatedAt,
                    UpdatedAt = DateTime.UtcNow
                };
                _repository.Add(entity);
                UpdateDoublesElo(state, leftWon);
            }

            return _stateManager.StartMatch();
        }

        public DoubleMatchStateDto ResetMatch()
        {
            var state = _stateManager.GetCurrentMatch();
            state.LeftTeamScore = 0;
            state.RightTeamScore = 0;
            state.FirstServer = null;
            state.CurrentServer = null;
            return _stateManager.SetMatchState(state);
        }

        public DoubleMatchStateDto AddPoint(PlayerEnum team)
        {
            var state = _stateManager.GetCurrentMatch();
            if (IsGameOver(state)) return state;

            if (IsFightForServe(state))
            {
                state.FirstServer = team;
                state.CurrentServer = team;
            }
            else
            {
                if (team == PlayerEnum.Left) state.LeftTeamScore++;
                else state.RightTeamScore++;

                int total = state.LeftTeamScore + state.RightTeamScore;
                bool deuce = state.LeftTeamScore >= 10 && state.RightTeamScore >= 10;
                if (deuce || (total % 2) == 0) SwitchServer(state);
            }

            state.UpdatedAt = DateTime.UtcNow;
            return _stateManager.SetMatchState(state);
        }

        public DoubleMatchStateDto SubtractPoint(PlayerEnum team)
        {
            var state = _stateManager.GetCurrentMatch();
            if (team == PlayerEnum.Left && state.LeftTeamScore > 0)
            {
                state.LeftTeamScore--;
                int total = state.LeftTeamScore + state.RightTeamScore;
                if ((total % 2) == 1) SwitchServer(state);
            }
            else if (team == PlayerEnum.Right && state.RightTeamScore > 0)
            {
                state.RightTeamScore--;
                int total = state.LeftTeamScore + state.RightTeamScore;
                if ((total % 2) == 1) SwitchServer(state);
            }
            state.UpdatedAt = DateTime.UtcNow;
            return _stateManager.SetMatchState(state);
        }

        public DoubleMatchStateDto SetPlayer(int position, PlayerDto player)
        {
            var state = _stateManager.GetCurrentMatch();
            switch (position)
            {
                case 1: state.LeftPlayer1 = player; break;
                case 2: state.LeftPlayer2 = player; break;
                case 3: state.RightPlayer1 = player; break;
                case 4: state.RightPlayer2 = player; break;
            }
            return _stateManager.SetMatchState(state);
        }

        public IEnumerable<DoubleMatchDto> GetMatchHistory()
        {
            return _repository.GetAll().Select(m => new DoubleMatchDto
            {
                DoubleMatchId = m.DoubleMatchId,
                LeftPlayer1 = m.LeftPlayer1 != null ? new PlayerDto(m.LeftPlayer1) : null,
                LeftPlayer2 = m.LeftPlayer2 != null ? new PlayerDto(m.LeftPlayer2) : null,
                RightPlayer1 = m.RightPlayer1 != null ? new PlayerDto(m.RightPlayer1) : null,
                RightPlayer2 = m.RightPlayer2 != null ? new PlayerDto(m.RightPlayer2) : null,
                LeftTeamScore = m.LeftTeamScore,
                RightTeamScore = m.RightTeamScore,
                LeftTeamWon = m.LeftTeamWon,
                StartTime = m.StartTime,
                EndTime = m.EndTime,
                IsFinished = m.IsFinished
            });
        }

        private void UpdateDoublesElo(DoubleMatchStateDto state, bool leftWon)
        {
            var lp1 = _playerRepository.Get(state.LeftPlayer1!.Id);
            var lp2 = _playerRepository.Get(state.LeftPlayer2!.Id);
            var rp1 = _playerRepository.Get(state.RightPlayer1!.Id);
            var rp2 = _playerRepository.Get(state.RightPlayer2!.Id);

            if (lp1 is null || lp2 is null || rp1 is null || rp2 is null) return;

            int leftAvg  = (lp1.EloDoubles + lp2.EloDoubles) / 2;
            int rightAvg = (rp1.EloDoubles + rp2.EloDoubles) / 2;

            int winDelta  = EloService.CalculateDoubleDelta(leftWon ? leftAvg : rightAvg, leftWon ? rightAvg : leftAvg);
            int lossDelta = EloService.CalculateDoubleDelta(leftWon ? rightAvg : leftAvg, leftWon ? leftAvg : rightAvg);

            if (leftWon)
            {
                _playerRepository.UpdateElo(lp1.Id, lp1.EloSingles, lp1.EloDoubles + winDelta);
                _playerRepository.UpdateElo(lp2.Id, lp2.EloSingles, lp2.EloDoubles + winDelta);
                _playerRepository.UpdateElo(rp1.Id, rp1.EloSingles, Math.Max(0, rp1.EloDoubles + lossDelta));
                _playerRepository.UpdateElo(rp2.Id, rp2.EloSingles, Math.Max(0, rp2.EloDoubles + lossDelta));
            }
            else
            {
                _playerRepository.UpdateElo(rp1.Id, rp1.EloSingles, rp1.EloDoubles + winDelta);
                _playerRepository.UpdateElo(rp2.Id, rp2.EloSingles, rp2.EloDoubles + winDelta);
                _playerRepository.UpdateElo(lp1.Id, lp1.EloSingles, Math.Max(0, lp1.EloDoubles + lossDelta));
                _playerRepository.UpdateElo(lp2.Id, lp2.EloSingles, Math.Max(0, lp2.EloDoubles + lossDelta));
            }
        }

        private static bool IsFightForServe(DoubleMatchStateDto s)
            => s.LeftTeamScore == 0 && s.RightTeamScore == 0 && s.FirstServer is null;

        private static void SwitchServer(DoubleMatchStateDto s)
            => s.CurrentServer = s.CurrentServer == PlayerEnum.Left ? PlayerEnum.Right : PlayerEnum.Left;

        private static bool IsGameOver(DoubleMatchStateDto s)
            => (s.LeftTeamScore >= 11 || s.RightTeamScore >= 11)
               && Math.Abs(s.LeftTeamScore - s.RightTeamScore) >= 2;
    }
}
