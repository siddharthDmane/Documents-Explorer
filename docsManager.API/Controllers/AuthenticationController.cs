using docsManager.API.Models.Domain;
using docsManager.API.Models.Dto.Authentication;
using docsManager.API.Models.Dto.Response;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace docsManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<UserProfile> userManager;
        private readonly IConfiguration configuration;
        public AuthenticationController(UserManager<UserProfile> userManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.configuration = configuration;
        }

        [HttpPost]
        [Route("Registration")]
        public async Task<IActionResult> UserRegistration([FromBody] AddUserDto userDto)
        {
            var userExist = await userManager.FindByEmailAsync(userDto.Email);
            if(userExist != null)
            {
                return Ok( 
                new ResponseDto{
                    Status = 300, 
                    Message = "User for this Email already exists."
                });
            }
            userExist = await userManager.FindByNameAsync(userDto.UserName);
            if (userExist != null)
            {
                return Ok(
                new ResponseDto
                {
                    Status = 300,
                    Message = "UserName already exists."
                });
            }
            else
            {
                if(userDto.ConfirmPassword != userDto.Password)
                {
                    return Ok(
                    new ResponseDto {
                        Status = 400,
                        Message = "Password and Confirm Password is mis-matching."
                    });
                }
                else {
                    var userDomain = new UserProfile { 
                        UserName = userDto.UserName,
                        Email = userDto.Email
                    };
                    var result = await userManager.CreateAsync(userDomain,userDto.Password);
                    if(result.Succeeded)
                    {
                        var roleResult = await userManager.AddToRoleAsync(userDomain,"user");
                        if(roleResult.Succeeded)
                        {
                            return Ok(new ResponseDto
                            {
                                Status = 200,
                                Message = "User Registered Successfully."
                            });
                        }
                    }
                }
            }
            return Ok(new ResponseDto
            {
                Status = 400,
                Message = "The minimum length of Password should be 6 and must contain 1 UpperCase, 1 LowerCase and 1 Special Character."
            });
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody]LoginDto loginDto)
        {
            var user = await userManager.Users.FirstOrDefaultAsync(u=> u.Email == loginDto.UserName || u.UserName == loginDto.UserName );
            if(user == null)
            {
                return Ok(new ResponseDto
                {
                    Status = 404,
                    Message = "UserName or Email does not exists."
                });
            }
            var passwordResult = await userManager.CheckPasswordAsync(user,loginDto.Password);
            if (passwordResult)
            {
                var roles = await userManager.GetRolesAsync(user);

                var claims = new List<Claim>();

                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                claims.Add(new Claim(ClaimTypes.Sid, user.Id));
                claims.Add(new Claim(ClaimTypes.Name, user.UserName));
                claims.Add(new Claim(ClaimTypes.Email, user.Email));

                var token = GenerateToken(claims);

                return Ok(new ResponseDto
                {
                    Status = 200,
                    Message = token.ToString()
                });
            }
            return Ok(new ResponseDto{
                Status = 400,
                Message = "Password is Incorrect."
            });
        }

        private string GenerateToken(List<Claim> claims) {

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                configuration["Jwt:Issuer"],
                configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
