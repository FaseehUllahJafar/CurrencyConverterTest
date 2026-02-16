using CurrencyConverter.Api.Models;
using CurrencyConverter.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CurrencyConverter.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CurrencyController : ControllerBase
    {
        private readonly ICurrencyService _service;

        public CurrencyController(ICurrencyService service)
        {
            _service = service;
        }

        [HttpGet("latest/{baseCurrency}")]
        public async Task<IActionResult> GetLatest(string baseCurrency)
        {
            var result = await _service.GetLatestRates(baseCurrency);
            return Ok(result);
        }

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

        [HttpGet("historical")]
        public async Task<IActionResult> GetHistorical([FromQuery] HistoricalRateRequest request)
        {
            var result = await _service.GetHistoricalRates(request);
            return Ok(result);
        }
    }
}
