using CurrencyConverter.Api.Providers;
using CurrencyConverter.Api.Services;

namespace CurrencyConverter.Api.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddCurrencyServices(this IServiceCollection services)
        {
            services.AddMemoryCache();
            services.AddHttpClient<ICurrencyProvider, FrankfurterCurrencyProvider>();
            services.AddScoped<ICurrencyService, CurrencyService>();
        }
    }
}
