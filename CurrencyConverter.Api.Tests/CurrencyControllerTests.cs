using CurrencyConverter.Api.Controllers;
using CurrencyConverter.Api.Models;
using CurrencyConverter.Api.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

public class CurrencyControllerTests
{
    private readonly Mock<ICurrencyService> _serviceMock;
    private readonly CurrencyController _controller;

    public CurrencyControllerTests()
    {
        _serviceMock = new Mock<ICurrencyService>();
        _controller = new CurrencyController(_serviceMock.Object);
    }

    [Fact]
    public async Task GetLatest_ReturnsOk()
    {
        _serviceMock.Setup(s => s.GetLatestRates("USD"))
            .ReturnsAsync(new ExchangeRateResponse { Base = "USD", Date = DateTime.UtcNow });

        var result = await _controller.GetLatest("USD");

        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task Convert_ReturnsBadRequest_OnArgumentException()
    {
        var request = new ConversionRequest { Amount = 10, FromCurrency = "USD", ToCurrency = "XXX" };

        _serviceMock.Setup(s => s.ConvertCurrency(request))
            .ThrowsAsync(new ArgumentException("Invalid target currency."));

        var result = await _controller.Convert(request);

        result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task GetHistorical_ReturnsOk()
    {
        var req = new HistoricalRateRequest { BaseCurrency = "USD", StartDate = DateTime.UtcNow.AddDays(-1), EndDate = DateTime.UtcNow };

        _serviceMock.Setup(s => s.GetHistoricalRates(req))
            .ReturnsAsync(new HistoricalRateResponse { Base = "USD" });

        var result = await _controller.GetHistorical(req);

        result.Should().BeOfType<OkObjectResult>();
    }
}
