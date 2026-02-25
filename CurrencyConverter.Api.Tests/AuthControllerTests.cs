using CurrencyConverter.Api.Controllers;
using CurrencyConverter.Api.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

public class AuthControllerTests
{
    [Fact]
    public void Login_ReturnsToken_ForAdmin()
    {
        var jwtMock = new Mock<IJwtService>();
        jwtMock.Setup(j => j.GenerateToken("admin", "Admin")).Returns("token-admin");

        var controller = new AuthController(jwtMock.Object);

        var actionResult = controller.Login("admin", "admin") as OkObjectResult;

        actionResult.Should().NotBeNull();

        var value = actionResult!.Value;
        var tokenProp = value?.GetType().GetProperty("token");
        tokenProp.Should().NotBeNull();
        var token = tokenProp!.GetValue(value) as string;
        token.Should().Be("token-admin");
    }

    [Fact]
    public void Login_ReturnsUnauthorized_ForInvalid()
    {
        var jwtMock = new Mock<IJwtService>();

        var controller = new AuthController(jwtMock.Object);

        var result = controller.Login("bad", "bad");

        result.Should().BeOfType<UnauthorizedResult>();
    }
}
