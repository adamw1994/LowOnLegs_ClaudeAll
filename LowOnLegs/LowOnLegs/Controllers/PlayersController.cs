using LowOnLegs.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LowOnLegs.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayersController : ControllerBase
    {
        private readonly IPlayerService _playerService;

        public PlayersController(IPlayerService playerService)
        {
            _playerService = playerService;
        }

        [HttpGet]
        public IActionResult GetPlayers()
        {
            var players = _playerService.GetPlayers();
            return new JsonResult(players);
        }
    }
}
