using CurrencyConverter.Api.Factories;
using CurrencyConverter.Api.Models;
using CurrencyConverter.Api.Providers;
using Microsoft.Extensions.Caching.Memory;

namespace CurrencyConverter.Api.Services
{

    public class CurrencyService : ICurrencyService
    {

        private readonly string[] _excludedCurrencies = { "TRY", "PLN", "THB", "MXN" };

        private readonly ICurrencyProviderFactory _providerFactory;
        private readonly IMemoryCache _cache;
        private readonly ILogger<CurrencyService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrencyService(ICurrencyProviderFactory providerFactory, IMemoryCache cache, ILogger<CurrencyService> logger, IHttpContextAccessor httpContextAccessor)
        {
            _providerFactory = providerFactory;
            _cache = cache;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }


        public async Task<ExchangeRateResponse> GetLatestRates(string baseCurrency)
        {
            _logger.LogInformation("Fetching latest rates for {BaseCurrency}", baseCurrency);

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
            _logger.LogInformation(
               "Starting currency conversion from {From} to {To} for {Amount}",
               request.FromCurrency,
               request.ToCurrency,
               request.Amount);

            if (_excludedCurrencies.Contains(request.FromCurrency.ToUpper()) ||
                _excludedCurrencies.Contains(request.ToCurrency.ToUpper()))
            {
                throw new ArgumentException("Conversion involving TRY, PLN, THB, or MXN is not allowed.");
            }

            var rates = await GetLatestRates(request.FromCurrency.ToUpper());

            if (!rates.Rates.TryGetValue(request.ToCurrency.ToUpper(), out var rate))
                throw new ArgumentException("Invalid target currency.");

            var converted = new ConversionResponse
            {
                OriginalAmount = request.Amount,
                FromCurrency = request.FromCurrency.ToUpper(),
                ToCurrency = request.ToCurrency.ToUpper(),
                Rate = rate,
                ConvertedAmount = request.Amount * rate
            };

            _logger.LogInformation(
                 "Conversion completed with rate {Rate} and result {Result}",
                 rate,
                 converted);
            return converted;
        }

        public async Task<HistoricalRateResponse> GetHistoricalRates(HistoricalRateRequest request)
        {
            request.BaseCurrency = request.BaseCurrency.ToUpper();

            _logger.LogInformation(
              "Fetching historical rates for {BaseCurrency} from {Start} to {End}",
              request.BaseCurrency,
              request.StartDate,
              request.EndDate);

            string cacheKey = $"historical_{request.BaseCurrency}_{request.StartDate:yyyyMMdd}_{request.EndDate:yyyyMMdd}";

            if (_cache.TryGetValue(cacheKey, out HistoricalRateResponse cachedData))
            {
                return PaginateHistoricalData(cachedData, request);
            }
            var provider = _providerFactory.GetProvider("Frankfurter");

            var data = await provider.GetHistoricalRatesAsync(request);

            var cacheOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(6),
                Priority = CacheItemPriority.Normal
            };

            _cache.Set(cacheKey, data, cacheOptions);

            _logger.LogInformation(
          "return historical rates for {BaseCurrency} from {Start} to {End}",
         data.Base,
         data.Start_Date,
         data.End_Date);

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
