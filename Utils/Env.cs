using System.Runtime.CompilerServices;

namespace bug_tracker.Utils
{
    public static class Env
    {
        [ModuleInitializer]
        public static void ReadEnvFile()
        {
            if (!File.Exists("./.env")) return;

            foreach (var line in File.ReadAllLines("./.env"))
            {
                if (string.IsNullOrWhiteSpace(line) || line.StartsWith("#")) continue;

                var parts = line.Split('=', 2);

                if (parts.Length == 2)
                {
                    var name = parts[0].Trim();
                    var value = parts[1].Trim();
                    value = value.Substring(1, value.Length - 2);
                    Environment.SetEnvironmentVariable(name, value);
                };
            };

        }

    }
}
