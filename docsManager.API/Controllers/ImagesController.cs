using docsManager.API.Data;
using docsManager.API.Models.Domain;
using docsManager.API.Models.Dto.Image;
using docsManager.API.Models.Dto.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace docsManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly UserManager<UserProfile> userManager;
        private readonly ExplorerDbContext dbContext;
        private readonly IWebHostEnvironment webHostEnvironment;
        private readonly IHttpContextAccessor httpContextAccessor;

        public ImagesController(UserManager<UserProfile> userManager, ExplorerDbContext dbContext, IWebHostEnvironment webHostEnvironment,
            IHttpContextAccessor httpContextAccessor)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
            this.webHostEnvironment = webHostEnvironment;
            this.httpContextAccessor = httpContextAccessor;
        }

        //Add Image to Folder
        [HttpPost]
        [Route("Add/Folder/{Id:guid}")]
        public async Task<IActionResult> AddImageToFolder([FromRoute] Guid Id, [FromForm] AddImageDto imageDto)
        {
            if (imageDto.Document == null)
            {
                return Ok(new ResponseDto
                {
                    Status = 400,
                    Message = "No File Uploaded !!"
                });
            }

            if (!IsImage(imageDto.Document.FileName) || !IsValidFileSize(imageDto.Document.Length))
            {
                return Ok(new ResponseDto
                {
                    Status = 400,
                    Message = "Invalid file type or size !!"
                });
            }

            var folderPath = Path.Combine(webHostEnvironment.ContentRootPath, "Storage/Images", imageDto.OwnerId, Id.ToString());
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            var extension = Path.GetExtension(imageDto.Document.FileName);
            var types = new List<String>() { ".jpg", ".jpeg", ".png"};
            var fname = "";
            var folderid = Id;

            types.ForEach(type => {
                if (imageDto.Name.Contains(type))
                {
                    fname = imageDto.Name;
                }
            });

            fname = fname == "" ? imageDto.Name + extension : fname;

            var localFilePath = Path.Combine(folderPath, fname);

            using var stream = new FileStream(localFilePath, FileMode.Create);
            await imageDto.Document.CopyToAsync(stream);

            var urlFilePath = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}{httpContextAccessor.HttpContext.Request.PathBase}/Storage/Images/{imageDto.OwnerId}/{folderid}/{fname}";

            var imageDomain = new Image
            {
                Name = fname,
                Type = Path.GetExtension(imageDto.Document.FileName),
                Size = (int)imageDto.Document.Length,
                Path = urlFilePath,
                CreatedDate = DateTime.Now,
                LastModifiedDate = DateTime.Now,
                ParentFolderId = Id, // Set appropriate ParentFolderId
                OwnerId = imageDto.OwnerId  // Set appropriate OwnerId
            };

            try
            {
                await dbContext.Images.AddAsync(imageDomain);
                await dbContext.SaveChangesAsync();
                return Ok(new APIResponseDto<Image>
                {
                    Status = 200,
                    Message = "Image Uploaded Successfully.",
                    Item = imageDomain
                });
            }
            catch (DbUpdateException dbEx)
            {
                return Ok(new ResponseDto
                {
                    Status = 500,
                    Message = "DataBase Error !!"
                });
            }
        }

        //Get all PDF's from requeted folder
        [HttpGet]
        [Route("GetAll/{Id:Guid}")]
        public async Task<IActionResult> GetAllPdfsByFolder([FromRoute] Guid Id)
        {
            var allImages = dbContext.Images.Include(x => x.User).Where(x => x.ParentFolderId == Id).ToList();
            if (allImages.Count() == 0)
            {
                return Ok(new APIResponseDto<PDF>
                {
                    Status = 404,
                    Message = "No Files Found.",
                    TotalCount = 0,
                    Items = null
                });
            }
            return Ok(new APIResponseDto<Image>
            {
                Status = 200,
                Message = "Files Fetched Succesfully.",
                TotalCount = allImages.Count(),
                Items = allImages
            });
        }

        //Get all Images of User
        [HttpGet]
        [Route("All/User/{Id:Guid}")]
        public async Task<IActionResult> GetAllImagesByUser([FromRoute] String Id)
        {
            var allImages = dbContext.Images.Include(x => x.User).Where(x => x.OwnerId == Id).ToList();
            if (allImages.Count() == 0)
            {
                return Ok(new APIResponseDto<PDF>
                {
                    Status = 404,
                    Message = "No Files Found.",
                    TotalCount = 0,
                    Items = null
                });
            }
            return Ok(new APIResponseDto<Image>
            {
                Status = 200,
                Message = "Files Fetched Succesfully.",
                TotalCount = allImages.Count(),
                Items = allImages
            });
        }

        //Get PDF by Id
        [HttpGet]
        [Route("Get/{Id:Guid}")]
        public async Task<IActionResult> GetPDFById([FromRoute] Guid Id)
        {
            var imageFile = await dbContext.Images.FirstOrDefaultAsync(x => x.Id == Id);
            if (imageFile == null)
            {
                return Ok(new ResponseDto
                {
                    Status = 404,
                    Message = "No File exists for this Id."
                });
            }
            return Ok(new APIResponseDto<Image>
            {
                Status = 200,
                Message = "File Fetched Successfully.",
                Item = imageFile
            });
        }


        private bool IsImage(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            if ( extension == ".jpg" || extension == ".jpeg" || extension == ".png" )
                return true;
            return false;
        }
        private bool IsValidFileSize(long length)
        {
            const long maxSize = 30 * 1024 * 1024; // 30 MB
            return length <= maxSize;
        }

    }
}
