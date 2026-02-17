using CurrencyConverter.Api.Models;
using CurrencyConverter.Api.Providers;

public class FakeCurrencyProvider : ICurrencyProvider
{
    public string ProviderName => "Fake";

    public Task<ExchangeRateResponse> GetLatestRatesAsync(string baseCurrency)
    {
        return Task.FromResult(new ExchangeRateResponse
        {
            Base = baseCurrency,
            Date = DateTime.UtcNow,
            Rates = new Dictionary<string, decimal>
            {
                { "EUR", 0.99m }
            }
        });
    }

    public Task<HistoricalRateResponse> GetHistoricalRatesAsync(HistoricalRateRequest request)
    {
        throw new NotImplementedException();
    }
}
