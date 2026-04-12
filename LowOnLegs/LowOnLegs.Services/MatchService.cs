using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Enums;
using LowOnLegs.Core.Interfaces;
using LowOnLegs.Core.Models;
using LowOnLegs.Data.Repositories.Interfaces;

namespace LowOnLegs.Services
{
    public class MatchService : IMatchService
    {
        private readonly IMatchRepository _matchRepository;
        private readonly IMatchStateManager _matchStateManager;
        private readonly IPlayerRepository _playerRepository;

        public MatchService(IMatchRepository matchRepository, IMatchStateManager matchStateManager, IPlayerRepository playerRepository)
        {
            _matchRepository = matchRepository;
            _matchStateManager = matchStateManager;
            _playerRepository = playerRepository;
        }

        public MatchStateDto StartMatch(PlayerDto? leftPlayer = null, PlayerDto? rightPlayer = null)
            => _matchStateManager.StartMatch(leftPlayer, rightPlayer);

        public MatchStateDto FinishMatch()
        {
            var state = _matchStateManager.GetCurrentMatch();
            var matchDto = state.ToMatchDto(state);

            if (matchDto.SaveMatchToDatabase)
            {
                _matchRepository.Add(matchDto.ToEntity());
                UpdateSinglesElo(state);
            }

            return _matchStateManager.StartMatch(state.LeftPlayer, state.RightPlayer);
        }

        public MatchStateDto ResetMatch()
        {
            var state = _matchStateManager.GetCurrentMatch();
            state.LeftPlayerScore = 0;
            state.RightPlayerScore = 0;
            state.FirstServer = null;
            state.CurrentServer = null;
            return _matchStateManager.SetMatchState(state);
        }

        public MatchStateDto AddPoint(PlayerEnum player)
        {
            var state = _matchStateManager.GetCurrentMatch();
            if (IsGameOver(state)) return state;

            if (IsFightForServe(state))
                InitializeFirstServer(state, player);
            else
                IncreasePlayerScore(player, state);

            return _matchStateManager.SetMatchState(state);
        }

        public MatchStateDto SubtractPoint(PlayerEnum player)
        {
            var state = _matchStateManager.GetCurrentMatch();
            DecreasePlayerScore(player, state);
            return _matchStateManager.SetMatchState(state);
        }

        public MatchStateDto SetLeftPlayer(PlayerDto player)
        {
            var state = _matchStateManager.GetCurrentMatch();
            state.LeftPlayer = player;
            return _matchStateManager.SetMatchState(state);
        }

        public MatchStateDto SetRightPlayer(PlayerDto player)
        {
            var state = _matchStateManager.GetCurrentMatch();
            state.RightPlayer = player;
            return _matchStateManager.SetMatchState(state);
        }

        public IEnumerable<MatchHistoryDto> GetMatchHistory()
            => _matchRepository.GetAll().Select(m => new MatchHistoryDto(m));

        private void UpdateSinglesElo(MatchStateDto state)
        {
            if (state.LeftPlayer is null || state.RightPlayer is null) return;

            bool leftWon = state.LeftPlayerScore > state.RightPlayerScore;
            int winnerId = leftWon ? state.LeftPlayer.Id : state.RightPlayer.Id;
            int loserId  = leftWon ? state.RightPlayer.Id : state.LeftPlayer.Id;

            var winnerDto = _playerRepository.Get(winnerId);
            var loserDto  = _playerRepository.Get(loserId);
            if (winnerDto is null || loserDto is null) return;

            var (newWinnerElo, newLoserElo) = EloService.Calculate(winnerDto.EloSingles, loserDto.EloSingles);

            _playerRepository.UpdateElo(winnerId, newWinnerElo, winnerDto.EloDoubles);
            _playerRepository.UpdateElo(loserId,  newLoserElo,  loserDto.EloDoubles);
        }

        private void IncreasePlayerScore(PlayerEnum player, MatchStateDto s)
        {
            if (!CanAddPoint(player, s)) return;

            if (player == PlayerEnum.Left)
            {
                s.LeftPlayerScore++;
                if (IsTimeToSwitchServer(s, PointOperation.Add)) SwitchServer(s);
            }
            else
            {
                s.RightPlayerScore++;
                if (IsTimeToSwitchServer(s, PointOperation.Add)) SwitchServer(s);
            }
            s.UpdatedAt = DateTime.UtcNow;
        }

        private void DecreasePlayerScore(PlayerEnum player, MatchStateDto s)
        {
            if (player == PlayerEnum.Left && s.LeftPlayerScore > 0)
            {
                s.LeftPlayerScore--;
                if (IsTimeToSwitchServer(s, PointOperation.Subtract)) SwitchServer(s);
            }
            else if (player == PlayerEnum.Right && s.RightPlayerScore > 0)
            {
                s.RightPlayerScore--;
                if (IsTimeToSwitchServer(s, PointOperation.Subtract)) SwitchServer(s);
            }
            s.UpdatedAt = DateTime.UtcNow;
        }

        private static bool IsTimeToSwitchServer(MatchStateDto s, PointOperation op)
        {
            int total = s.LeftPlayerScore + s.RightPlayerScore;
            if (IsDeucePhase(s)) return true;
            return op == PointOperation.Add ? (total % 2) == 0 : (total % 2) == 1;
        }

        private static bool IsFightForServe(MatchStateDto s)
            => s.LeftPlayerScore == 0 && s.RightPlayerScore == 0 && s.FirstServer is null;

        private static void InitializeFirstServer(MatchStateDto s, PlayerEnum player)
        {
            s.FirstServer = player;
            s.CurrentServer = player;
            s.UpdatedAt = DateTime.UtcNow;
        }

        private static void SwitchServer(MatchStateDto s)
            => s.CurrentServer = s.CurrentServer == PlayerEnum.Left ? PlayerEnum.Right : PlayerEnum.Left;

        private static bool IsDeucePhase(MatchStateDto s)
            => s.LeftPlayerScore >= 10 && s.RightPlayerScore >= 10;

        private static bool IsGameOver(MatchStateDto s)
            => (s.LeftPlayerScore >= 11 || s.RightPlayerScore >= 11)
               && Math.Abs(s.LeftPlayerScore - s.RightPlayerScore) >= 2;

        private static bool CanAddPoint(PlayerEnum player, MatchStateDto s)
        {
            if (IsGameOver(s)) return false;
            if (!IsDeucePhase(s))
            {
                if (player == PlayerEnum.Left  && s.LeftPlayerScore  >= 11) return false;
                if (player == PlayerEnum.Right && s.RightPlayerScore >= 11) return false;
            }
            return true;
        }
    }
}
