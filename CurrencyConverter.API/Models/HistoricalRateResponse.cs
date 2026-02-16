namespace CurrencyConverter.Api.Models
{
    public class HistoricalRateResponse
    {
        public string Base { get; set; } = "";
        public string Start_Date { get; set; } = "";
        public string End_Date { get; set; } = "";
        public Dictionary<string, Dictionary<string, decimal>> Rates { get; set; } = new();
    }
}
