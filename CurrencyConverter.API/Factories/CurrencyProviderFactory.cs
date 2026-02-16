using CurrencyConverter.Api.Providers;

namespace CurrencyConverter.Api.Factories
{
    public class CurrencyProviderFactory
    {
        private readonly IServiceProvider _provider;

        public CurrencyProviderFactory(IServiceProvider provider)
        {
            _provider = provider;
        }

        public ICurrencyProvider GetProvider()
        {
            // For now, only Frankfurter is implemented
            return _provider.GetRequiredService<ICurrencyProvider>();
        }
    }
}
