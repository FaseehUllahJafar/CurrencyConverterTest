using CurrencyConverter.Api.Models;
using CurrencyConverter.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CurrencyConverter.Api.Controllers
{
    [EnableRateLimiting("fixed")]
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CurrencyController : ControllerBase
    {
        private readonly ICurrencyService _service;

        public CurrencyController(ICurrencyService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Admin,User")]
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatest(string baseCurrency)
        {
            var result = await _service.GetLatestRates(baseCurrency);
            return Ok(result);
        }

        [Authorize(Roles = "Admin,User")]
        [HttpPost("convert")]
        public async Task<IActionResult> Convert([FromBody] ConversionRequest request)
        {
            try
            {
                var result = await _service.ConvertCurrency(request);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("historical")]
        public async Task<IActionResult> GetHistorical([FromQuery] HistoricalRateRequest request)
        {
            var result = await _service.GetHistoricalRates(request);
            return Ok(result);
        }
    }
}
