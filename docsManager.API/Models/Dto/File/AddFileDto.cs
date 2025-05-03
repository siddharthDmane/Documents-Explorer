namespace docsManager.API.Models.Dto.File
{
    public class AddFileDto
    {
        public string Name { get; set; }
        public IFormFile Document { get; set; }
        public string OwnerId { get; set; }
    }
}
