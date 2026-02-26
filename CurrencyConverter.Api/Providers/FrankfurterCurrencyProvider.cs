using CurrencyConverter.Api.Models;
using System.Net.Http.Json;
using System.Text.Json;

namespace CurrencyConverter.Api.Providers
{
    public class FrankfurterCurrencyProvider : ICurrencyProvider
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<FrankfurterCurrencyProvider> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public string ProviderName => "Frankfurter";

        public FrankfurterCurrencyProvider(HttpClient httpClient, ILogger<FrankfurterCurrencyProvider> logger, IHttpContextAccessor httpContextAccessor)
        {
            _httpClient = httpClient;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ExchangeRateResponse> GetLatestRatesAsync(string baseCurrency)
        {
            var correlationId = _httpContextAccessor.HttpContext?.TraceIdentifier;
            var url = $"latest?from={baseCurrency}";
            
            _logger.LogInformation(
              "Calling Frankfurter API: {Url} with CorrelationId {CorrelationId}",
              url,
              correlationId);

            var response = await _httpClient.GetAsync(url);

            _logger.LogInformation(
                "Frankfurter API responded with status {StatusCode}",
                response.StatusCode);

            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();

            var result = JsonSerializer.Deserialize<ExchangeRateResponse>(
                content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return result!;
        }

        public async Task<HistoricalRateResponse> GetHistoricalRatesAsync(HistoricalRateRequest request)
        {
            var correlationId = _httpContextAccessor.HttpContext?.TraceIdentifier;

            var url =
                $"{request.StartDate:yyyy-MM-dd}..{request.EndDate:yyyy-MM-dd}?from={request.BaseCurrency}";

            _logger.LogInformation(
                "Calling Frankfurter Historical API: {Url} with CorrelationId {CorrelationId}",
                url,
                correlationId);

            var response = await _httpClient.GetAsync(url);

            _logger.LogInformation(
                "Frankfurter Historical API responded with {StatusCode}",
                response.StatusCode);

            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();

            var result = JsonSerializer.Deserialize<HistoricalRateResponse>(
                content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return result!;
        }
    }
}
