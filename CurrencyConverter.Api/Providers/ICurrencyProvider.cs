using CurrencyConverter.Api.Models;

namespace CurrencyConverter.Api.Providers
{
    public interface ICurrencyProvider
    {
        string ProviderName { get; }

        Task<ExchangeRateResponse> GetLatestRatesAsync(string baseCurrency);

        Task<HistoricalRateResponse> GetHistoricalRatesAsync(HistoricalRateRequest request);
    }
}
