namespace backend
{
    //This model represents a withdraw/deposit transaction for our piggy bank
    public class TransactionRecord
    {
        //positive value = deposit
        //negative value = withdrawal
        private double amount;

        private DateTime when;

        public DateTime When { get => when; set => when = value; }
        public double Amount { get => amount; set => amount = value; }
    }
}
