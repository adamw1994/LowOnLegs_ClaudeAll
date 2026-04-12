using LowOnLegs.API.Hubs;
using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Enums;
using LowOnLegs.Core.Interfaces;
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

        [HttpGet]
        public IActionResult GetHistory() => Ok(_matchService.GetMatchHistory());

        [HttpPost("start")]
        public IActionResult StartMatch() => Ok(_matchService.StartMatch());

        [HttpPost("finish")]
        public IActionResult FinishMatch() => Ok(_matchService.FinishMatch());

        [HttpPost("reset")]
        public IActionResult ResetMatch() => Ok(_matchService.ResetMatch());

        [HttpPost("add-point")]
        public async Task<IActionResult> AddPoint([FromQuery] PlayerEnum player)
        {
            var state = _matchService.AddPoint(player);
            await _hub.Clients.All.SendAsync("UpdateScore", new
            {
                leftScore = state.LeftPlayerScore,
                rightScore = state.RightPlayerScore
            });
            return Ok(state);
        }

        [HttpPost("subtract-point")]
        public async Task<IActionResult> SubtractPoint([FromQuery] PlayerEnum player)
        {
            var state = _matchService.SubtractPoint(player);
            await _hub.Clients.All.SendAsync("UpdateScore", new
            {
                leftScore = state.LeftPlayerScore,
                rightScore = state.RightPlayerScore
            });
            return Ok(state);
        }

        [HttpPost("set-left-player/{playerId}")]
        public IActionResult SetLeftPlayer(int playerId)
        {
            var player = _playerService.GetPlayer(playerId);
            return Ok(_matchService.SetLeftPlayer(player));
        }

        [HttpPost("set-right-player/{playerId}")]
        public IActionResult SetRightPlayer(int playerId)
        {
            var player = _playerService.GetPlayer(playerId);
            return Ok(_matchService.SetRightPlayer(player));
        }
    }
}
