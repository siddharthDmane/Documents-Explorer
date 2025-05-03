namespace docsManager.API.Models.Dto.Users
{
    public class UserDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public List<string>? Role { get; set; }

    }
}
