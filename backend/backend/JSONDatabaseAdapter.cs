using System.Text.Json;

namespace backend
{
    //Save operations can fail for a variety of reasons, in which case the respective method returns false
    //This needs to be handled by the controller and returned to the client in an appropriate HTTPResponse
    //Since these failures are definitely considered exceptions it would arguably be better to use those
    //But for the sake of simplicity in this particular project i still chose to go with booleans
    public class JSONDatabaseAdapter : BaseDatabaseAdapter
    {
        private const string fileName = "database.json";
        private JSONDatabaseModel accountData;

        public JSONDatabaseAdapter()
        {
            accountData = LoadDatabase();
        }

        public bool Deposit(double amount)
        {
            accountData.Balance += amount;
            return SaveDatabase();
        }
        public bool SetSavingsGoal(double amount)
        {
            accountData.SavingsGoal = amount;
            return SaveDatabase();
        }

        public bool Withdraw(double amount)
        {
            accountData.Balance -= amount;
            return SaveDatabase();
        }

        public bool AddTransactionRecord(TransactionRecord transactionRecord)
        {
            accountData.TransactionHistory.Add(transactionRecord);
            return SaveDatabase();
        }

        public double GetBalance()
        {
            return accountData.Balance;
        }

        public double GetSavingsGoal()
        {
            return accountData.SavingsGoal;
        }

        public List<TransactionRecord> GetTransactionHistory()
        {
            return accountData.TransactionHistory;
        }

        private JSONDatabaseModel LoadDatabase()
        {
            JSONDatabaseModel? ret;

            try
            {
                string contents = File.ReadAllText(fileName);
                ret = JsonSerializer.Deserialize<JSONDatabaseModel>(contents) ?? new JSONDatabaseModel();
            }
            catch (Exception)
            {
                ret = new JSONDatabaseModel();
            }

            return ret;
        }

        private bool SaveDatabase()
        {
            try
            {
                File.WriteAllText(fileName, JsonSerializer.Serialize(accountData, new JsonSerializerOptions { 
                    WriteIndented = true 
                }));

                return true;

            } catch (Exception)
            {
                return false;
            }            
        }
    }
}
