using LowOnLegs.Core.DTOs;
using LowOnLegs.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LowOnLegs.API.Controllers
{
    public class AddPlayerRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public IFormFile? Image { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class PlayersController : ControllerBase
    {
        private readonly IPlayerService _playerService;
        private readonly IWebHostEnvironment _env;

        public PlayersController(IPlayerService playerService, IWebHostEnvironment env)
        {
            _playerService = playerService;
            _env = env;
        }

        [HttpGet]
        public IActionResult GetPlayers() => Ok(_playerService.GetPlayers());

        [HttpGet("{id}")]
        public IActionResult GetPlayer(int id) => Ok(_playerService.GetPlayer(id));

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AddPlayer([FromForm] AddPlayerRequest request)
        {
            var uploadsPath = Path.Combine(_env.ContentRootPath, "uploads");
            string? imagePath = null;

            if (request.Image is not null && request.Image.Length > 0)
            {
                Directory.CreateDirectory(uploadsPath);
                var ext = Path.GetExtension(request.Image.FileName);
                var fileName = $"{Guid.NewGuid()}{ext}";
                using var stream = System.IO.File.Create(Path.Combine(uploadsPath, fileName));
                await request.Image.CopyToAsync(stream);
                imagePath = $"/uploads/{fileName}";
            }

            var dto = new CreatePlayerDto
            {
                Name = request.Name,
                Surname = request.Surname,
                Nickname = request.Nickname,
                Email = request.Email,
                Phone = request.Phone,
                ImagePath = imagePath
            };

            var player = await _playerService.AddPlayer(dto);
            return CreatedAtAction(nameof(GetPlayer), new { id = player.Id }, player);
        }
    }
}
