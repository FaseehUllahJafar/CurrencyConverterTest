using CurrencyConverter.Api.Providers;
using CurrencyConverter.Api.Services;
using Microsoft.Extensions.Http.Resilience;
using Polly;
using System.Net;

namespace CurrencyConverter.Api.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddCurrencyServices(this IServiceCollection services)
        {
            services.AddMemoryCache();

            services.AddHttpClient<ICurrencyProvider, FrankfurterCurrencyProvider>(client =>
            {
                client.BaseAddress = new Uri("https://api.frankfurter.app/");
            })
            .AddStandardResilienceHandler(options =>
            {
                // Retry configuration
                options.Retry.MaxRetryAttempts = 3;
                options.Retry.BackoffType = DelayBackoffType.Exponential;
                options.Retry.Delay = TimeSpan.FromSeconds(2);

                // Circuit breaker configuration
                options.CircuitBreaker.FailureRatio = 0.5;
                options.CircuitBreaker.MinimumThroughput = 5;
                options.CircuitBreaker.BreakDuration = TimeSpan.FromSeconds(30);

                // Timeout (optional but recommended)
                options.AttemptTimeout.Timeout = TimeSpan.FromSeconds(10);
            });

            services.AddScoped<ICurrencyService, CurrencyService>();
        }
    }
}
