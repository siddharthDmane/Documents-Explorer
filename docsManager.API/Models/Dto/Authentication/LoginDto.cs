using System.ComponentModel.DataAnnotations;

namespace docsManager.API.Models.Dto.Authentication
{
    public class LoginDto
    {
        [Required(ErrorMessage ="UserName is required field !!")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Password is required field !!")]
        public string Password { get; set; }
    }
}
