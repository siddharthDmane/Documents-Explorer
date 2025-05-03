using docsManager.API.Data;
using docsManager.API.Models.Domain;
using docsManager.API.Models.Dto.Common;
using docsManager.API.Models.Dto.File;
using docsManager.API.Models.Dto.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.X509;

namespace docsManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly UserManager<UserProfile> userManager;
        private readonly ExplorerDbContext dbContext;
        private readonly IWebHostEnvironment webHostEnvironment;
        private readonly IHttpContextAccessor httpContextAccessor;

        public FilesController(UserManager<UserProfile> userManager, ExplorerDbContext dbContext, IWebHostEnvironment webHostEnvironment,
            IHttpContextAccessor httpContextAccessor)
        {
            this.userManager = userManager;
            this.dbContext = dbContext;
            this.webHostEnvironment = webHostEnvironment;
            this.httpContextAccessor = httpContextAccessor;
        }

        //Add PDF to requested folder
        [HttpPost]
        [Route("Add/Folder/{Id:Guid}")]
        public async Task<IActionResult> AddPDFFile([FromRoute] Guid Id, [FromForm] AddFileDto fileDto)
        {
            if(fileDto.Document == null)
            {
                return Ok(new ResponseDto
                {
                    Status = 400,
                    Message = "No File Uploaded !!"
                });
            }

            if (!IsPDF(fileDto.Document.FileName) || !IsValidFileSize(fileDto.Document.Length))
            {
                return Ok(new ResponseDto
                {
                    Status = 400,
                    Message = "Invalid file type or size !!"
                });
            }

            var folderPath = Path.Combine(webHostEnvironment.ContentRootPath, "Storage/Files",fileDto.OwnerId,Id.ToString());
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            var extension = Path.GetExtension(fileDto.Document.FileName);
            var localFilePath = Path.Combine(folderPath, fileDto.Name.Contains(".pdf") ? fileDto.Name : fileDto.Name + extension);

            using var stream = new FileStream(localFilePath, FileMode.Create);
            await fileDto.Document.CopyToAsync(stream);
            var folderid = Id;
            var fname = fileDto.Name.Contains(".pdf") ? fileDto.Name : fileDto.Name + extension;
            var urlFilePath = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}{httpContextAccessor.HttpContext.Request.PathBase}/Storage/Files/{fileDto.OwnerId}/{folderid}/{fname}";            

            var pdf = new PDF
            {
                Name = fileDto.Name.Contains(".pdf") ? fileDto.Name : fileDto.Name + extension,
                Type = Path.GetExtension(fileDto.Document.FileName),
                Size = (int)fileDto.Document.Length,
                Path = urlFilePath,
                CreatedDate = DateTime.Now,
                LastModifiedDate = DateTime.Now,
                ParentFolderId = Id, // Set appropriate ParentFolderId
                OwnerId = fileDto.OwnerId  // Set appropriate OwnerId
            };

            try
            {
                await dbContext.Files.AddAsync(pdf);
                await dbContext.SaveChangesAsync();
                return Ok(new APIResponseDto<PDF>
                {
                    Status = 200,
                    Message = "File Uploaded Successfully.",
                    Item = pdf
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

        //Get PDF by Id
        [HttpGet]
        [Route("Get/{Id:Guid}")]
        public async Task<IActionResult> GetPDFById([FromRoute] Guid Id)
        {
            var pdfFile = await dbContext.Files.FirstOrDefaultAsync(x => x.Id == Id);
            if (pdfFile == null)
            {
                return Ok(new ResponseDto { 
                    Status=404,
                    Message="No File exists for this Id."
                });
            }
            return Ok(new APIResponseDto<PDF>
            {
                Status=200,
                Message="File Fetched Successfully.",
                Item=pdfFile
            });
        }

        //Get all PDF's from requeted folder
        [HttpGet]
        [Route("GetAll/{Id:Guid}")]
        public async Task<IActionResult> GetAllPdfsByFolder([FromRoute] Guid Id)
        {
            var allPdfs = dbContext.Files.Include(x => x.User).Where(x => x.ParentFolderId == Id).ToList();
            if(allPdfs.Count() == 0)
            {
                return Ok(new APIResponseDto<PDF>
                {
                    Status = 404,
                    Message = "No Files Found.",
                    TotalCount = 0,
                    Items = null
                });
            }
            return Ok(new APIResponseDto<PDF>
            {
                Status = 200,
                Message = "Files Fetched Succesfully.",
                TotalCount = allPdfs.Count(),
                Items = allPdfs
            });
        }

        //Delete PDF by Id
        [HttpPost]
        [Route("Delete/{Id:Guid}")]
        public async Task<IActionResult> DeletePdfById([FromRoute] Guid Id)
        {
            var pdfFile = await dbContext.Files.FirstOrDefaultAsync(x => x.Id == Id);
            var hostingPath = "";
            if (pdfFile != null)
            {
                hostingPath = pdfFile.Path;
                var relativePath = hostingPath.Replace("https://localhost:7054/", string.Empty);
                var physicalPath = Path.Combine(webHostEnvironment.ContentRootPath, relativePath);

                if (System.IO.File.Exists(physicalPath))
                {
                    // Delete the file
                    System.IO.File.Delete(physicalPath);
                    dbContext.Files.Remove(pdfFile);
                    await dbContext.SaveChangesAsync();
                    return Ok(new ResponseDto { 
                        Status = 200,
                        Message = "File deleted successfully." 
                    });
                }
                else
                {
                    return Ok(new ResponseDto
                    {
                        Status = 404,
                        Message = "File not found."
                    });
                }
            }
            return Ok(new ResponseDto
            {
                Status = 404,
                Message = "File not found."
            });
        }


        //Rename PDF by Id
        [HttpPost]
        [Route("Rename/{Id:Guid}")]
        public async Task<IActionResult> RenamePdfById([FromRoute] Guid Id, [FromBody] RenameDto newFileName)
        {
            var pdfFile = await dbContext.Files.FirstOrDefaultAsync(x => x.Id == Id);
            var hostingPath = "";

            if (pdfFile != null)
            {
                hostingPath = pdfFile.Path;
                //get Extension
                var extension = Path.GetExtension(hostingPath);
                var fname = newFileName.Name.Contains(".pdf") ? newFileName.Name : newFileName.Name + extension;
                //get only folders path
                var relativePath = hostingPath.Replace("https://localhost:7054/", string.Empty);
                //spliting folders path into array to acces the folder's GUID
                var elements = relativePath.Split('/');
                //complete old physical path for file
                var oldPhysicalPath = Path.Combine(webHostEnvironment.ContentRootPath, relativePath);
                //get only direcory path excluding filename
                var directoryPath = Path.GetDirectoryName(oldPhysicalPath);
                //new complete physical path for file
                var newPhysicalPath = Path.Combine(directoryPath, $"{fname}");
                //hosting url path for file
                var url = $"https://localhost:7054/Storage/Files/{elements[2]}/{elements[3]}/{fname}";

                if (System.IO.File.Exists(oldPhysicalPath))
                {
                    // Rename (move) the file
                    System.IO.File.Move(oldPhysicalPath, newPhysicalPath);
                    pdfFile.Name = newFileName.Name.Contains(".pdf") ? newFileName.Name : newFileName.Name + extension;
                    pdfFile.Path = url;
                    pdfFile.LastModifiedDate = DateTime.Now;
                    await dbContext.SaveChangesAsync();
                    return Ok(new ResponseDto
                    {
                        Status = 200,
                        Message = "File renamed successfully."
                    });
                }
                else
                {
                    return Ok(new ResponseDto
                    {
                        Status = 404,
                        Message = "File not found."
                    });
                }
            }
            return Ok(new ResponseDto
            {
                Status = 404,
                Message = "File not found."
            });
        }

        [HttpPost]
        [Route("GetPDFNames/{Id:Guid}")]
        public async Task<IActionResult> GetAllPDFNAmes([FromRoute] Guid Id, [FromBody] string fileName)
        {
            var reqFileName = fileName.Contains(".pdf") ? fileName : fileName + ".pdf";
            var allFileNames = dbContext.Files.Where(x => x.ParentFolderId == Id).Select(x => x.Name).ToList();
            if (allFileNames.Contains(reqFileName))
            {
                return Ok(new ResponseDto
                {
                    Status = 200,
                    Message = "true"
                });
            }
            return Ok(new ResponseDto
            {
                Status = 200,
                Message = "false"
            });
        }

        private bool IsPDF(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            if (extension == ".pdf")
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
