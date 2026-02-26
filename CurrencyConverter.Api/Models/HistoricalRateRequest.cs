namespace CurrencyConverter.Api.Models
{
    public class HistoricalRateRequest
    {
        public string BaseCurrency { get; set; } = "";
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
