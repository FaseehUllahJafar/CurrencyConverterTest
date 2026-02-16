using CurrencyConverter.Api.Factories;
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

        private readonly string[] _excludedCurrencies = { "TRY", "PLN", "THB", "MXN" };

        private readonly ICurrencyProviderFactory _providerFactory;
        private readonly IMemoryCache _cache;

        public CurrencyService(
            ICurrencyProviderFactory providerFactory,
            IMemoryCache cache)
        {
            _providerFactory = providerFactory;
            _cache = cache;
        }


        public async Task<ExchangeRateResponse> GetLatestRates(string baseCurrency)
        {
            string cacheKey = $"latest_{baseCurrency.ToUpper()}";

            if (_cache.TryGetValue(cacheKey, out ExchangeRateResponse cachedRates))
            {
                return cachedRates;
            }

            var provider = _providerFactory.GetProvider("Frankfurter");
            var rates = await provider.GetLatestRatesAsync(baseCurrency);


            var cacheOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
                SlidingExpiration = TimeSpan.FromMinutes(5),
                Priority = CacheItemPriority.High
            };

            _cache.Set(cacheKey, rates, cacheOptions);

            return rates;
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
            string cacheKey = $"historical_{request.BaseCurrency}_{request.StartDate:yyyyMMdd}_{request.EndDate:yyyyMMdd}";

            if (_cache.TryGetValue(cacheKey, out HistoricalRateResponse cachedData))
            {
                return PaginateHistoricalData(cachedData, request);
            }
            var provider = _providerFactory.GetProvider("Frankfurter");

            var data = await provider.GetHistoricalRatesAsync(
                request.BaseCurrency.ToUpper(),
                request.StartDate,
                request.EndDate
            );

            var cacheOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(6),
                Priority = CacheItemPriority.Normal
            };

            _cache.Set(cacheKey, data, cacheOptions);

            return PaginateHistoricalData(data, request);
        }

        //helper
        private HistoricalRateResponse PaginateHistoricalData(HistoricalRateResponse data, HistoricalRateRequest request)
        {
            var pagedRates = data.Rates
                .OrderBy(r => r.Key)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToDictionary(x => x.Key, x => x.Value);

            return new HistoricalRateResponse
            {
                Base = data.Base,
                Start_Date = data.Start_Date,
                End_Date = data.End_Date,
                Rates = pagedRates
            };
        }



    }
}
