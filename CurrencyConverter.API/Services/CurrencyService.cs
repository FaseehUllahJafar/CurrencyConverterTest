using CurrencyConverter.Api.Models;
using CurrencyConverter.Api.Providers;
using Microsoft.Extensions.Caching.Memory;

namespace CurrencyConverter.Api.Services
{
    public interface ICurrencyService
    {
        Task<ExchangeRateResponse> GetLatestRates(string baseCurrency);
        Task<ConversionResponse> ConvertCurrency(ConversionRequest request);
        Task<HistoricalRateResponse> GetHistoricalRates(HistoricalRateRequest request);
    }

    public class CurrencyService : ICurrencyService
    {
        private readonly ICurrencyProvider _provider;
        private readonly IMemoryCache _cache;
        private readonly string[] _excludedCurrencies = { "TRY", "PLN", "THB", "MXN" };

        public CurrencyService(ICurrencyProvider provider, IMemoryCache cache)
        {
            _provider = provider;
            _cache = cache;
        }

        public async Task<ExchangeRateResponse> GetLatestRates(string baseCurrency)
        {
            return await _cache.GetOrCreateAsync($"latest_{baseCurrency}", async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);
                return await _provider.GetLatestRatesAsync(baseCurrency);
            });
        }

        public async Task<ConversionResponse> ConvertCurrency(ConversionRequest request)
        {
            if (_excludedCurrencies.Contains(request.FromCurrency.ToUpper()) ||
                _excludedCurrencies.Contains(request.ToCurrency.ToUpper()))
            {
                throw new ArgumentException("Conversion involving TRY, PLN, THB, or MXN is not allowed.");
            }

            var rates = await GetLatestRates(request.FromCurrency.ToUpper());

            if (!rates.Rates.TryGetValue(request.ToCurrency.ToUpper(), out var rate))
                throw new ArgumentException("Invalid target currency.");

            return new ConversionResponse
            {
                OriginalAmount = request.Amount,
                FromCurrency = request.FromCurrency.ToUpper(),
                ToCurrency = request.ToCurrency.ToUpper(),
                Rate = rate,
                ConvertedAmount = request.Amount * rate
            };
        }

        public async Task<HistoricalRateResponse> GetHistoricalRates(HistoricalRateRequest request)
        {
            // Call provider
            var allRates = await _provider.GetHistoricalRatesAsync(request.BaseCurrency.ToUpper(), request.StartDate, request.EndDate);

            // Sort dates
            var sortedRates = allRates.Rates
                .OrderBy(r => r.Key)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToDictionary(x => x.Key, x => x.Value);

            return new HistoricalRateResponse
            {
                Base = allRates.Base,
                Start_Date = allRates.Start_Date,
                End_Date = allRates.End_Date,
                Rates = sortedRates
            };
        }


    }
}
