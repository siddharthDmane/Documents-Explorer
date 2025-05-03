using docsManager.API.Data;
using docsManager.API.Models.Domain;
using docsManager.API.Models.Dto.Common;
using docsManager.API.Models.Dto.Folder;
using docsManager.API.Models.Dto.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace docsManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoldersController : ControllerBase
    {
        private readonly UserManager<UserProfile> userManager;
        private readonly ExplorerDbContext dbContext;

        public FoldersController(UserManager<UserProfile> userManager, ExplorerDbContext dbContext)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
        }

        //Get All Folders by User Id
        [HttpGet]
        [Route("User/{id:Guid}")]
        public async Task<IActionResult> GetAllFoldersByUserId([FromRoute] string id)
        {
            var allFolders = await dbContext.Folders.Where(f => f.OwnerId == id).ToListAsync();
            if(allFolders.Count() == 0)
            {
                return Ok(new APIResponseDto<Folder>
                {
                    Status = 200,
                    Message = "No any folder exist for requested user.",
                    TotalCount = 0,
                    Items = null
                });
            }
            return Ok(new APIResponseDto<Folder> {
                Status = 200,
                Message = "Request Successfull !!",
                TotalCount = allFolders.Count(),
                Items = allFolders
            });
        }

        //Add Folder to requested user
        [HttpPost]
        [Route("Add/{id:Guid}")]
        public async Task<IActionResult> AddFolder([FromRoute] string id, [FromBody] AddFolderDto folderDto)
        {
            var folder = new Folder
            {
                Name = folderDto.Name,
                CreatedDate = DateTime.Now,
                LastModifiedDate = DateTime.Now,
                OwnerId = id,
                ParentFolderId = folderDto.ParentFolderId,
            };
            await dbContext.Folders.AddAsync(folder);
            await dbContext.SaveChangesAsync();
            return Ok(new APIResponseDto<Folder>
            {
                Status = 200,
                Message = "Folder added successfully.",
                Item = folder
            });
        }

        //Rename the Folder
        [HttpPost]
        [Route("Rename/{Id:Guid}")]
        public async Task<IActionResult> RenameFolder([FromRoute] Guid Id, [FromBody] RenameDto renameDto)
        {
            var resFolder = await dbContext.Folders.FirstOrDefaultAsync(x => x.Id == Id);
            if(resFolder == null)
            {
                return Ok(new ResponseDto
                {
                    Status = 404,
                    Message = "No Folder found for this Id."
                });
            }
            resFolder.Name = renameDto.Name;
            resFolder.LastModifiedDate = DateTime.Now;
            await dbContext.SaveChangesAsync();
            return Ok(new APIResponseDto<Folder>
            {
                Status = 200,
                Message = "Folder Renamed !!",
                Item = resFolder
            });
        }

    }
}
