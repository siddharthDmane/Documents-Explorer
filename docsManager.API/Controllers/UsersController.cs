using docsManager.API.Data;
using docsManager.API.Models.Domain;
using docsManager.API.Models.Dto.Response;
using docsManager.API.Models.Dto.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace docsManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<UserProfile> userManager;
        private readonly ExplorerDbContext dbContext;

        public UsersController(UserManager<UserProfile> userManager,ExplorerDbContext dbContext) {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        [HttpGet]
        [Route("All")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await userManager.Users.ToListAsync();
            if(users.Count() == 0)
            {
                return Ok(new APIResponseDto<UserDto>
                {
                    Status = 200,
                    Message = "No users present !!",
                    TotalCount = 0,
                    Items = null
                });
            }

            var allUsers = new List<UserDto>();

            foreach(var user in users)
            {
                var role = await userManager.GetRolesAsync(user);

                allUsers.Add(new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = role.ToList()
                }) ;
            }

            return Ok(new APIResponseDto<UserDto>
            {
                Status = 200,
                Message = "Users fetched successfully.",
                TotalCount = allUsers.Count(),
                Items = allUsers
            });
        }

    }
}
