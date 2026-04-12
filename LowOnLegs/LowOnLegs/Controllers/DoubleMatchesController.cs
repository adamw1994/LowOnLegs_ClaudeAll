using LowOnLegs.API.Hubs;
using LowOnLegs.Core.Enums;
using LowOnLegs.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace LowOnLegs.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoubleMatchesController : ControllerBase
    {
        private readonly IDoubleMatchService _service;
        private readonly IPlayerService _playerService;
        private readonly IHubContext<ScoreboardHub> _hub;

        public DoubleMatchesController(IDoubleMatchService service, IPlayerService playerService, IHubContext<ScoreboardHub> hub)
        {
            _service = service;
            _playerService = playerService;
            _hub = hub;
        }

        [HttpGet]
        public IActionResult GetHistory() => Ok(_service.GetMatchHistory());

        [HttpPost("start")]
        public IActionResult StartMatch() => Ok(_service.StartMatch());

        [HttpPost("finish")]
        public IActionResult FinishMatch() => Ok(_service.FinishMatch());

        [HttpPost("reset")]
        public IActionResult ResetMatch() => Ok(_service.ResetMatch());

        [HttpPost("add-point")]
        public async Task<IActionResult> AddPoint([FromQuery] PlayerEnum team)
        {
            var state = _service.AddPoint(team);
            await _hub.Clients.All.SendAsync("UpdateDoubleScore", new
            {
                leftScore = state.LeftTeamScore,
                rightScore = state.RightTeamScore
            });
            return Ok(state);
        }

        [HttpPost("subtract-point")]
        public async Task<IActionResult> SubtractPoint([FromQuery] PlayerEnum team)
        {
            var state = _service.SubtractPoint(team);
            await _hub.Clients.All.SendAsync("UpdateDoubleScore", new
            {
                leftScore = state.LeftTeamScore,
                rightScore = state.RightTeamScore
            });
            return Ok(state);
        }

        [HttpPost("set-player/{position}/{playerId}")]
        public IActionResult SetPlayer(int position, int playerId)
        {
            var player = _playerService.GetPlayer(playerId);
            return Ok(_service.SetPlayer(position, player));
        }
    }
}
