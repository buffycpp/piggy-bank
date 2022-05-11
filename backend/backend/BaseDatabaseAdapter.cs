namespace backend
{
    //Interface to define the requirements for a save/load adapter that is responsible for state management of our piggy bank
    public interface BaseDatabaseAdapter
    {
        public bool Deposit(double amount);
        public bool Withdraw(double amount);
        public bool SetSavingsGoal(double amount);

        public bool AddTransactionRecord(TransactionRecord transactionRecord);
        public double GetBalance();
        public double GetSavingsGoal();

        public List<TransactionRecord> GetTransactionHistory();
    }
}
