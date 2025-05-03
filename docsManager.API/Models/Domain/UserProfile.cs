using Microsoft.AspNetCore.Identity;

namespace docsManager.API.Models.Domain
{
    public class UserProfile : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }

    }
}
