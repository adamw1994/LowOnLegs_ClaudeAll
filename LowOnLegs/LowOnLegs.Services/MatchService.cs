using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Enums;
using LowOnLegs.Core.Interfaces;
using LowOnLegs.Core.Models;
using LowOnLegs.Data;
using LowOnLegs.Data.Repositories.Interfaces;
using System;

namespace LowOnLegs.Services
{
    public class MatchService : IMatchService
    {
        private IMatchRepository matchRepository;
        private IMatchStateManager matchStateManager;

        public MatchService(IMatchRepository matchRepository, IMatchStateManager matchStateManager)
        {
            this.matchRepository = matchRepository;
            this.matchStateManager = matchStateManager;
        }

        public MatchStateDto StartMatch(PlayerDto? leftPlayer = null, PlayerDto? rightPlayer = null)
        {
            return matchStateManager.StartMatch(leftPlayer, rightPlayer);
        }

        public MatchStateDto FinishMatch()
        {
            var matchStateDto = matchStateManager.GetCurrentMatch();


            var matchDto = matchStateDto.ToMatchDto(matchStateDto);

            if (matchDto.SaveMatchToDatabase)
            {
                matchRepository.Add(matchDto.ToEntity());
            }
            return matchStateManager.StartMatch(matchStateDto.LeftPlayer, matchStateDto.RightPlayer);
        }

        public MatchStateDto ResetMatch()
        {
            var matchStateDto = matchStateManager.GetCurrentMatch();
            matchStateDto.LeftPlayerScore = 0;
            matchStateDto.RightPlayerScore = 0;
            matchStateDto.FirstServer = null;
            matchStateDto.CurrentServer = null;
            return matchStateManager.SetMatchState(matchStateDto);
        }

        public MatchStateDto AddPoint(PlayerEnum player)
        {
            var matchStateDto = matchStateManager.GetCurrentMatch();

            // Jeżeli mecz już jest rozstrzygnięty – nie pozwalamy dodawać punktów
            if (IsGameOver(matchStateDto))
                return matchStateDto;

            if (IsFightForServe(matchStateDto))
            {
                InitializeFirstServer(matchStateDto, player);
            }
            else
            {
                IncreasePlayerScore(player, matchStateDto);
            }

            return matchStateManager.SetMatchState(matchStateDto);
        }

        public MatchStateDto SubtractPoint(PlayerEnum player)
        {
            var matchStateDto = matchStateManager.GetCurrentMatch();

            DecreasePlayerScore(player, matchStateDto);

            return matchStateManager.SetMatchState(matchStateDto);
        }

        private void IncreasePlayerScore(PlayerEnum player, MatchStateDto matchStateDto)
        {
            if (!CanAddPoint(player, matchStateDto))
                return;

            switch (player)
            {
                case PlayerEnum.Left:
                    matchStateDto.LeftPlayerScore++;
                    if (IsTimeToSwitchServer(matchStateDto, PointOperation.Add))
                    {
                        SwitchCurrentServer(matchStateDto);
                    }
                    break;

                case PlayerEnum.Right:
                    matchStateDto.RightPlayerScore++;
                    if (IsTimeToSwitchServer(matchStateDto, PointOperation.Add))
                    {
                        SwitchCurrentServer(matchStateDto);
                    }
                    break;
            }

            matchStateDto.UpdatedAt = DateTime.UtcNow;
        }

        private void DecreasePlayerScore(PlayerEnum player, MatchStateDto matchStateDto)
        {
            switch (player)
            {
                case PlayerEnum.Left:
                    if (matchStateDto.LeftPlayerScore > 0)
                    {
                        matchStateDto.LeftPlayerScore--;
                        if (IsTimeToSwitchServer(matchStateDto, PointOperation.Subtract))
                        {
                            SwitchCurrentServer(matchStateDto);
                        }
                    }
                    break;

                case PlayerEnum.Right:
                    if (matchStateDto.RightPlayerScore > 0)
                    {
                        matchStateDto.RightPlayerScore--;
                        if (IsTimeToSwitchServer(matchStateDto, PointOperation.Subtract))
                        {
                            SwitchCurrentServer(matchStateDto);
                        }
                    }
                    break;
            }

            matchStateDto.UpdatedAt = DateTime.UtcNow;
        }

        private bool IsTimeToSwitchServer(MatchStateDto s, PointOperation operation)
        {
            int total = s.LeftPlayerScore + s.RightPlayerScore;

            if (IsDeucePhase(s))
            {
                return true;
            }

            if (operation == PointOperation.Add)
            {
                return (total % 2) == 0;  // 2,4,6...
            }
            else
            {
                return (total % 2) == 1;  // cofnięcie: 1,3,5...
            }
        }

        private bool IsFightForServe(MatchStateDto matchStateDto)
        {
            return matchStateDto.LeftPlayerScore == default &&
                   matchStateDto.RightPlayerScore == default &&
                   matchStateDto.FirstServer is null;
        }

        private void InitializeFirstServer(MatchStateDto matchStateDto, PlayerEnum player)
        {
            matchStateDto.FirstServer = player;
            matchStateDto.CurrentServer = player;
            matchStateDto.UpdatedAt = DateTime.UtcNow;
        }

        public MatchStateDto SetLeftPlayer(PlayerDto player)
        {
            var matchStateDto = matchStateManager.GetCurrentMatch();
            matchStateDto.LeftPlayer = player;
            return matchStateManager.SetMatchState(matchStateDto);
        }

        public MatchStateDto SetRightPlayer(PlayerDto player)
        {
            var matchStateDto = matchStateManager.GetCurrentMatch();
            matchStateDto.RightPlayer = player;
            return matchStateManager.SetMatchState(matchStateDto);
        }

        private static void SwitchCurrentServer(MatchStateDto matchStateDto)
        {
            matchStateDto.CurrentServer = matchStateDto.CurrentServer == PlayerEnum.Left
                ? PlayerEnum.Right
                : PlayerEnum.Left;
        }

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
                if (player == PlayerEnum.Left && s.LeftPlayerScore >= 11) 
                    return false;
                if (player == PlayerEnum.Right && s.RightPlayerScore >= 11) 
                    return false;
            }

            return true;
        }
    }
}
