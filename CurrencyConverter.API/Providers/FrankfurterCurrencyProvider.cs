using CurrencyConverter.Api.Models;
using System.Net.Http.Json;

namespace CurrencyConverter.Api.Providers
{
    public interface ICurrencyProvider
    {
        Task<ExchangeRateResponse> GetLatestRatesAsync(string baseCurrency);
        Task<HistoricalRateResponse> GetHistoricalRatesAsync(string baseCurrency, DateTime start, DateTime end);
    }

    public class FrankfurterCurrencyProvider : ICurrencyProvider
    {
        private readonly HttpClient _httpClient;

        public FrankfurterCurrencyProvider(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<ExchangeRateResponse> GetLatestRatesAsync(string baseCurrency)
        {
            var response = await _httpClient.GetFromJsonAsync<ExchangeRateResponse>(
                $"latest?base={baseCurrency}");

            return response!;
        }

        public async Task<HistoricalRateResponse> GetHistoricalRatesAsync(string baseCurrency, DateTime start, DateTime end)
        {
            var response = await _httpClient.GetFromJsonAsync<HistoricalRateResponse>(
                $"{start:yyyy-MM-dd}..{end:yyyy-MM-dd}?base={baseCurrency}");

            return response!;
        }

    }
}
