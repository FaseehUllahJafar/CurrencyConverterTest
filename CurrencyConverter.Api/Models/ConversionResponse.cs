namespace CurrencyConverter.Api.Models
{
    public class ConversionResponse
    {
        public decimal OriginalAmount { get; set; }
        public string FromCurrency { get; set; } = "";
        public string ToCurrency { get; set; } = "";
        public decimal ConvertedAmount { get; set; }
        public decimal Rate { get; set; }
    }
}
