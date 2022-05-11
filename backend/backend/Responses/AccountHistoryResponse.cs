namespace backend.Responses
{
    public class AccountHistoryResponse
    {
        public List<TransactionRecord> History { get; set; } = new List<TransactionRecord>();
    }
}
