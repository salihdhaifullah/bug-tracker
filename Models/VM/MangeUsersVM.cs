using Buegee.Models.DB;

namespace Buegee.Models.VM;

public class MangeUsersVM {
    public class User {
        public int Id {get; set;}
        public string Email {get; set;} = null!;
        public string FirstName {get; set;} = null!;
        public string LastName {get; set;} = null!;
        public Roles Role {get; set;}
        public byte[]? Image {get; set;}
    }

    public List<User> Users { get; set; } = null!;
    public decimal Pages { get; set; }
}
