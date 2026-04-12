using LowOnLegs.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LowOnLegs.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatsController : ControllerBase
    {
        private readonly IStatsService _statsService;

        public StatsController(IStatsService statsService)
        {
            _statsService = statsService;
        }

        [HttpGet("elo/singles")]
        public IActionResult GetSinglesElo() => Ok(_statsService.GetSinglesEloRanking());

        [HttpGet("elo/doubles")]
        public IActionResult GetDoublesElo() => Ok(_statsService.GetDoublesEloRanking());

        [HttpGet("head-to-head")]
        public IActionResult GetHeadToHead() => Ok(_statsService.GetHeadToHead());
    }
}
