namespace backend
{
    public class JSONDatabaseModel
    {
        private double balance;
        private double savingsGoal;
        private List<TransactionRecord> transactionHistory;

        public JSONDatabaseModel()
        {
            balance = 0;
            savingsGoal = 0;
            transactionHistory = new List<TransactionRecord>();
        }

        public double Balance { get => balance; set => balance = value; }
        public double SavingsGoal { get => savingsGoal; set => savingsGoal = value; }
        public List<TransactionRecord> TransactionHistory { get => transactionHistory; set => transactionHistory = value; }
    }
}
