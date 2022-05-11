namespace backend
{
    //The current Adapter implementation is a JSON one.
    //However, as a 'future proofing'-concept, any other (like MySQL) Adapter could be implemented
    //And plugged in right here without having to make adjustments to the remaining code base
    public static class Database
    {
        private static BaseDatabaseAdapter _adapter = new JSONDatabaseAdapter();

        public static BaseDatabaseAdapter Adapter { get => _adapter; }
    }
}
