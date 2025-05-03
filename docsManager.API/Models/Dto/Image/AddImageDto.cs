namespace docsManager.API.Models.Dto.Image
{
    public class AddImageDto
    {
        public string Name { get; set; }
        public IFormFile Document { get; set; }
        public string OwnerId { get; set; }
    }
}
