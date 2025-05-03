using docsManager.API.Models.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace docsManager.API.Data
{
    public class ExplorerDbContext : IdentityDbContext<UserProfile>
    {
        public ExplorerDbContext(DbContextOptions<ExplorerDbContext> options) : base(options) {

        }

        public DbSet<Folder> Folders { get; set; }
        public DbSet<PDF> Files { get; set; }
        public DbSet<Image> Images { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {       
            // Seeding the roles
            modelBuilder.Entity<IdentityRole>().HasData(
                new IdentityRole { Name = "admin", NormalizedName = "ADMIN" },
                new IdentityRole { Name = "user", NormalizedName = "USER" }
            );

            modelBuilder.Entity<Folder>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f=>f.OwnerId);

            modelBuilder.Entity<Folder>()
                .HasOne(f => f.ParentFolder)
                .WithMany()
                .HasForeignKey(f => f.ParentFolderId)
                .OnDelete(DeleteBehavior.Restrict);

            // PDF navigation property
            modelBuilder.Entity<PDF>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.OwnerId);

            modelBuilder.Entity<PDF>()
                .HasOne(p => p.ParentFolder)
                .WithMany()
                .HasForeignKey(p => p.ParentFolderId);

            // Images navigation property
            modelBuilder.Entity<Image>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.OwnerId);

            modelBuilder.Entity<Image>()
                .HasOne(p => p.ParentFolder)
                .WithMany()
                .HasForeignKey(p => p.ParentFolderId);

            base.OnModelCreating(modelBuilder);
        }

    }
}
