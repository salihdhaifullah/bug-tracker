namespace bug_tracker.Services.HashCompar
{
    public interface IHashCompar
    {
        public (byte[] hash, byte[] salt) Hash(string source);
        public bool Compar(string source, byte[] hash, byte[] salt);
    }
}
