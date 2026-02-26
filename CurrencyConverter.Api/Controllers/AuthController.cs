using CurrencyConverter.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CurrencyConverter.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IJwtService _jwtService;

        public AuthController(IJwtService jwtService)
        {
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public IActionResult Login(string username, string password)
        {
            // Fake validation

            if (username == "admin" && password == "admin")
                return Ok(new { token = _jwtService.GenerateToken(username, "Admin") });

            if (username == "user" && password == "user")
                return Ok(new { token = _jwtService.GenerateToken(username, "User") });

            return Unauthorized();
        }
    }
}
