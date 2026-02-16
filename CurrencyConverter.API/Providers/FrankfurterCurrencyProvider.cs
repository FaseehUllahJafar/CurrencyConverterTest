using CurrencyConverter.Api.Models;
using System.Net.Http.Json;

namespace CurrencyConverter.Api.Providers
{
    public class FrankfurterCurrencyProvider : ICurrencyProvider
    {
        private readonly HttpClient _httpClient;

        public string ProviderName => "Frankfurter";

        public FrankfurterCurrencyProvider(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<ExchangeRateResponse> GetLatestRatesAsync(string baseCurrency)
        {
            return await _httpClient.GetFromJsonAsync<ExchangeRateResponse>(
                $"latest?base={baseCurrency}")
                ?? throw new Exception("Failed to fetch latest rates.");
        }

        public async Task<HistoricalRateResponse> GetHistoricalRatesAsync(
            string baseCurrency,
            DateTime start,
            DateTime end)
        {
            return await _httpClient.GetFromJsonAsync<HistoricalRateResponse>(
                $"{start:yyyy-MM-dd}..{end:yyyy-MM-dd}?base={baseCurrency}")
                ?? throw new Exception("Failed to fetch historical rates.");
        }
    }
}
