using Microsoft.AspNetCore.Identity;

namespace docsManager.API.Models.Domain
{
    public class Folder
    {
        public Guid Id { get;set; }
        public string Name { get; set; }
        public int? Size { get; set; } = 0;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime LastModifiedDate { get; set; } = DateTime.Now;
        public Guid? ParentFolderId { get; set; } 
        public string OwnerId { get; set; } 

        //Navigation Property
        public UserProfile User { get; set; }
        public Folder? ParentFolder { get; set; }
    }
}
