using CurrencyConverter.Api.Providers;

namespace CurrencyConverter.Api.Factories
{
    public interface ICurrencyProviderFactory
    {
        ICurrencyProvider GetProvider(string providerName);
    }

    public class CurrencyProviderFactory : ICurrencyProviderFactory
    {
        private readonly IEnumerable<ICurrencyProvider> _providers;

        public CurrencyProviderFactory(IEnumerable<ICurrencyProvider> providers)
        {
            _providers = providers;
        }

        public ICurrencyProvider GetProvider(string providerName)
        {
            var provider = _providers.FirstOrDefault(p =>
                p.ProviderName.Equals(providerName, StringComparison.OrdinalIgnoreCase));

            if (provider == null)
                throw new NotSupportedException($"Provider '{providerName}' is not supported.");

            return provider;
        }
    }
}
