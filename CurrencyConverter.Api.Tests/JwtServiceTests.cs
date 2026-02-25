using CurrencyConverter.Api.Services;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Xunit;

public class JwtServiceTests
{
    [Fact]
    public void GenerateToken_ReturnsNonEmptyToken()
    {
        var inMemory = new Dictionary<string, string?>
        {
            { "Jwt:Key", "THIS_IS_A_SUPER_SECRET_KEY_12345" },
            { "Jwt:Issuer", "TestIssuer" },
            { "Jwt:Audience", "TestAudience" },
            { "Jwt:ExpiryMinutes", "60" }
        };

        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemory)
            .Build();

        var service = new JwtService(config);

        var token = service.GenerateToken("user", "User");

        token.Should().NotBeNullOrWhiteSpace();
    }
}
