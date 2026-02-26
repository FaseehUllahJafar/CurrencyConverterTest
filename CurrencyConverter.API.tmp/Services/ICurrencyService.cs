using CurrencyConverter.Api.Models;

namespace CurrencyConverter.Api.Services
{
    public interface ICurrencyService
    {
        Task<ExchangeRateResponse> GetLatestRates(string baseCurrency);
        Task<ConversionResponse> ConvertCurrency(ConversionRequest request);
        Task<HistoricalRateResponse> GetHistoricalRates(HistoricalRateRequest request);
    }
}
