using LowOnLegs.API.Hubs;
using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Enums;
using LowOnLegs.Core.Interfaces;
using LowOnLegs.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace LowOnLegs.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchesController : ControllerBase
    {
        private readonly IMatchService _matchService;
        private readonly IPlayerService _playerService;
        private readonly IHubContext<ScoreboardHub> _hub;

        public MatchesController(IMatchService matchService, IPlayerService playerService, IHubContext<ScoreboardHub> hub)
        {
            _matchService = matchService;
            _playerService = playerService;
            _hub = hub;
        }

        [HttpPost("start")]
        public async Task<IActionResult> StartMatch()
        {
            var matchStateDto = _matchService.StartMatch();
            return await Task.FromResult(new JsonResult(matchStateDto));
        }


        [HttpPost("finish")]
        public async Task<IActionResult> FinishMatch()
        {
            var matchStateDto = _matchService.FinishMatch();
            return await Task.FromResult(new JsonResult(matchStateDto));
        }

        [HttpPost("reset")]
        public async Task<IActionResult> ResetMatch()
        {
            var matchStateDto = _matchService.ResetMatch();
            return await Task.FromResult(new JsonResult(matchStateDto));
        }

        [HttpPost("add-point")]
        public async Task<IActionResult> AddPoint(PlayerEnum player)
        {
            var matchStateDto = _matchService.AddPoint(player);
            await _hub.Clients.All.SendAsync("UpdateScore", new
            {
                leftPlayer = matchStateDto.LeftPlayerScore,
                rightPlayer = matchStateDto.RightPlayerScore
            });
            return await Task.FromResult(new JsonResult(matchStateDto));
        }

        [HttpPost("subtract-point")]
        public async Task<IActionResult> SubtractPoint(PlayerEnum player)
        {
            var matchStateDto = _matchService.SubtractPoint(player);

            await _hub.Clients.All.SendAsync("UpdateScore", new
            {
                leftPlayer = matchStateDto.LeftPlayerScore,
                rightPlayer = matchStateDto.RightPlayerScore
            });

            return await Task.FromResult(new JsonResult(matchStateDto));
        }

        [HttpPost("set-left-player/{playerId}")]
        public async Task<IActionResult> SetLeftPlayer(int playerId)
        {
            var playerDto = _playerService.GetPlayer(playerId);
            var matchStateDto = _matchService.SetLeftPlayer(playerDto);
            return await Task.FromResult(new JsonResult(matchStateDto));
        }

        [HttpPost("set-right-player/{playerId}")]
        public async Task<IActionResult> SetRightPlayer(int playerId)
        {
            var playerDto = _playerService.GetPlayer(playerId);
            var matchStateDto = _matchService.SetRightPlayer(playerDto);
            return await Task.FromResult(new JsonResult(matchStateDto));
        }
    }
}
