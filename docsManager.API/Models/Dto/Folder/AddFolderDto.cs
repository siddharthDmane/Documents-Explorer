namespace docsManager.API.Models.Dto.Folder
{
    public class AddFolderDto
    {
        public string Name { get; set; }
        public Guid? ParentFolderId { get; set; }
    }
}
