using System.Net.Http.Headers;
using System.Net.Http.Json;
using CurrencyConverter.Api.Models;
using FluentAssertions;
using Xunit;

public class CurrencyIntegrationTests
    : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public CurrencyIntegrationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    private async Task<string> GetToken(string username, string password)
    {
        var response = await _client.PostAsync(
            $"/api/auth/login?username={username}&password={password}",
            null);

        var content = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new Exception($"Login failed: {response.StatusCode} - {content}");

        var json = System.Text.Json.JsonDocument.Parse(content);

        return json.RootElement.GetProperty("token").GetString()!;
    }


    [Fact]
    public async Task LatestRates_ShouldReturn200()
    {
        // Arrange
        var token = await GetToken("user", "user");

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync(
            "/api/v1/currency/latest?baseCurrency=USD");

        // Assert
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);
    }

    [Fact]
    public async Task Historical_ShouldRequireAdmin()
    {
        var token = await GetToken("user", "user");

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.GetAsync(
            "/api/v1/currency/historical?BaseCurrency=USD&StartDate=2024-01-01&EndDate=2024-01-05");

        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Forbidden);
    }
}
