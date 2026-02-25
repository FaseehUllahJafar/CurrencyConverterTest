using CurrencyConverter.Api.Factories;
using CurrencyConverter.Api.Models;
using CurrencyConverter.Api.Providers;
using CurrencyConverter.Api.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

public class CurrencyServiceTests
{
    private readonly Mock<ICurrencyProviderFactory> _factoryMock;
    private readonly Mock<ICurrencyProvider> _providerMock;
    private readonly IMemoryCache _cache;
    private readonly Mock<ILogger<CurrencyService>> _loggerMock;
    private readonly Mock<IHttpContextAccessor> _httpContextMock;

    private readonly CurrencyService _service;

    public CurrencyServiceTests()
    {
        _factoryMock = new Mock<ICurrencyProviderFactory>();
        _providerMock = new Mock<ICurrencyProvider>();
        _loggerMock = new Mock<ILogger<CurrencyService>>();
        _httpContextMock = new Mock<IHttpContextAccessor>();
        _cache = new MemoryCache(new MemoryCacheOptions());

        _factoryMock
            .Setup(f => f.GetProvider("Frankfurter"))
            .Returns(_providerMock.Object);

        _service = new CurrencyService(
            _factoryMock.Object,
            _cache,
            _loggerMock.Object,
            _httpContextMock.Object
        );
    }

    [Fact]
    public async Task ConvertCurrency_ShouldReturnConvertedAmount()
    {
        // Arrange
        var request = new ConversionRequest
        {
            Amount = 100,
            FromCurrency = "USD",
            ToCurrency = "EUR"
        };

        _providerMock
            .Setup(p => p.GetLatestRatesAsync("USD"))
            .ReturnsAsync(new ExchangeRateResponse
            {
                Base = "USD",
                Date = DateTime.UtcNow,
                Rates = new Dictionary<string, decimal>
                {
                    { "EUR", 0.5m }
                }
            });

        // Act
        var result = await _service.ConvertCurrency(request);

        // Assert
        result.ConvertedAmount.Should().Be(50);
        result.FromCurrency.Should().Be("USD");
        result.ToCurrency.Should().Be("EUR");
        result.Rate.Should().Be(0.5m);
    }

    [Fact]
    public async Task ConvertCurrency_ShouldThrow_WhenCurrencyNotFound()
    {
        var request = new ConversionRequest
        {
            Amount = 100,
            FromCurrency = "USD",
            ToCurrency = "XXX"
        };

        _providerMock
            .Setup(p => p.GetLatestRatesAsync("USD"))
            .ReturnsAsync(new ExchangeRateResponse
            {
                Base = "USD",
                Date = DateTime.UtcNow,
                Rates = new Dictionary<string, decimal>()
            });

        await Assert.ThrowsAsync<ArgumentException>(
            () => _service.ConvertCurrency(request)
        );
    }

    [Fact]
    public async Task GetHistoricalRates_ShouldApplyPagination()
    {
        var request = new HistoricalRateRequest
        {
            BaseCurrency = "USD",
            StartDate = DateTime.UtcNow.AddDays(-5),
            EndDate = DateTime.UtcNow,
            Page = 1,
            PageSize = 2
        };

        var historicalData = new HistoricalRateResponse
        {
            Base = "USD",
            Start_Date = "2024-01-01",
            End_Date = "2024-01-05",
            Rates = new Dictionary<string, Dictionary<string, decimal>>
        {
            { "2024-01-01", new() { { "EUR", 0.9m } } },
            { "2024-01-02", new() { { "EUR", 0.8m } } },
            { "2024-01-03", new() { { "EUR", 0.7m } } }
        }
        };

        _providerMock
            .Setup(p => p.GetHistoricalRatesAsync(It.IsAny<HistoricalRateRequest>()))
            .ReturnsAsync(historicalData);

        var result = await _service.GetHistoricalRates(request);

        result.Rates.Count.Should().Be(2);
    }

    [Fact]
    public async Task GetLatestRates_ShouldCacheResult()
    {
        // Arrange
        _providerMock
            .Setup(p => p.GetLatestRatesAsync("USD"))
            .ReturnsAsync(new ExchangeRateResponse
            {
                Base = "USD",
                Date = DateTime.UtcNow,
                Rates = new Dictionary<string, decimal>
                {
                    { "EUR", 0.5m }
                }
            });

        // Act - first call should populate cache
        var first = await _service.GetLatestRates("USD");

        // change provider to throw if called again
        _providerMock
            .Setup(p => p.GetLatestRatesAsync("USD"))
            .Throws(new Exception("Should not be called when cached"));

        // Act - second call should come from cache
        var second = await _service.GetLatestRates("USD");

        // Assert
        first.Should().NotBeNull();
        second.Should().NotBeNull();
        second.Rates["EUR"].Should().Be(0.5m);
    }

    [Fact]
    public async Task ConvertCurrency_ShouldThrow_ForExcludedCurrency()
    {
        var request = new ConversionRequest
        {
            Amount = 10,
            FromCurrency = "TRY",
            ToCurrency = "EUR"
        };

        await Assert.ThrowsAsync<ArgumentException>(
            () => _service.ConvertCurrency(request)
        );
    }

}
