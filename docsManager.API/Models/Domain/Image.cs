namespace docsManager.API.Models.Domain
{
    public class Image
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public int Size { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime LastModifiedDate { get; set; } = DateTime.Now;
        public string Path { get; set; }
        public Guid ParentFolderId { get; set; }
        public string OwnerId { get; set; }

        //Navigation Property
        public UserProfile User { get; set; }
        public Folder ParentFolder { get; set; }
    }
}
