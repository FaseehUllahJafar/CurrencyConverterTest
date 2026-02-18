using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

public class CustomWebApplicationFactory
    : WebApplicationFactory<Program>
{
    protected override IHost CreateHost(IHostBuilder builder)
    {
        builder.ConfigureAppConfiguration(config =>
        {
            var settings = new Dictionary<string, string>
            {
                { "Jwt:Key", "THIS_IS_A_SUPER_SECRET_KEY_12345" },
                { "Jwt:Issuer", "TestIssuer" },
                { "Jwt:Audience", "TestAudience" },
                { "Jwt:ExpiryMinutes", "60" }
            };

            config.AddInMemoryCollection(settings!);
        });

        return base.CreateHost(builder);
    }
}
