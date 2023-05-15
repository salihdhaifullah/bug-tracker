using System.Text;

namespace Buegee.Extensions.Utils;
public static class RandomCode {
    public static string NewRandomCode(int Length = 6) {
        var Random = new Random();
        var CodeBS = new StringBuilder();

        for (int i = 0; i < Length; i++) CodeBS.Append(Random.Next(10));

        // generate random 6 digits code
        return CodeBS.ToString();
    }
}
