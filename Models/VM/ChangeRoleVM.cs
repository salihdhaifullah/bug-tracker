using System.ComponentModel.DataAnnotations;
using Buegee.Extensions.Enums;

namespace Buegee.Models.VM;

public class ChangeRoleVM {
        public string Email {get; set;} = null!;
        public string FirstName {get; set;} = null!;
        public string LastName {get; set;} = null!;
        public Roles Role {get; set;}
        public int ImageId {get; set;}
    public class ChangeRoleVMDto {
        [RegularExpression("PROJECT_MANGER|REPORTER|DEVELOPER", ErrorMessage = "Invalid role")]
        public string NewRole {get; set;} = null!;
    }
}
