using LowOnLegs.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace LowOnLegs.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Player> Players { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<DoubleMatch> DoubleMatches { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Player>(entity =>
            {
                entity.HasKey(e => e.PlayerId);
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.Surname).IsRequired();
                entity.Property(e => e.Nickname).IsRequired();
                entity.Property(e => e.Email).IsRequired(false);
                entity.Property(e => e.CreatedAt).IsRequired(false);
                entity.Property(e => e.UpdatedAt).IsRequired(false);
                entity.Property(e => e.EloSingles).HasDefaultValue(1000);
                entity.Property(e => e.EloDoubles).HasDefaultValue(1000);
            });

            modelBuilder.Entity<Match>(entity =>
            {
                entity.HasKey(e => e.MatchId);
                entity.Property(e => e.StartTime).IsRequired();
                entity.Property(e => e.IsFinished).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt).IsRequired();

                entity.HasOne(m => m.LeftPlayer)
                      .WithMany(p => p.Matches)
                      .HasForeignKey(m => m.LeftPlayerId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(m => m.RightPlayer)
                      .WithMany()
                      .HasForeignKey(m => m.RightPlayerId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(m => m.Winner)
                      .WithMany(p => p.MatchesWon)
                      .HasForeignKey(m => m.WinnerId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<DoubleMatch>(entity =>
            {
                entity.HasKey(e => e.DoubleMatchId);
                entity.Property(e => e.StartTime).IsRequired();
                entity.Property(e => e.IsFinished).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt).IsRequired();

                entity.HasOne(m => m.LeftPlayer1).WithMany()
                      .HasForeignKey(m => m.LeftPlayer1Id).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(m => m.LeftPlayer2).WithMany()
                      .HasForeignKey(m => m.LeftPlayer2Id).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(m => m.RightPlayer1).WithMany()
                      .HasForeignKey(m => m.RightPlayer1Id).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(m => m.RightPlayer2).WithMany()
                      .HasForeignKey(m => m.RightPlayer2Id).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Player>().HasData(
                new Player { PlayerId = 1, Name = "Piotr",   Surname = "Klimkowski", Nickname = "Klimko",      ImagePath = "/images/klimko.png",   EloSingles = 1000, EloDoubles = 1000 },
                new Player { PlayerId = 2, Name = "Igor",    Surname = "Gresista",   Nickname = "Igorakowiec", ImagePath = "/images/igor.png",     EloSingles = 1000, EloDoubles = 1000 },
                new Player { PlayerId = 3, Name = "Jakub",   Surname = "Stadniczuk", Nickname = "Kuba",        ImagePath = "/images/kuba.png",     EloSingles = 1000, EloDoubles = 1000 },
                new Player { PlayerId = 4, Name = "Dawid",   Surname = "Posała",     Nickname = "Braciak",     ImagePath = "/images/braciak.png",  EloSingles = 1000, EloDoubles = 1000 },
                new Player { PlayerId = 5, Name = "Michał",  Surname = "Gliwa",      Nickname = "Gliwa",       ImagePath = "/images/gliwa.png",    EloSingles = 1000, EloDoubles = 1000 },
                new Player { PlayerId = 6, Name = "Adam",    Surname = "Wybraniec",  Nickname = "Fred",        ImagePath = "/images/fred.png",     EloSingles = 1000, EloDoubles = 1000 },
                new Player { PlayerId = 7, Name = "Karolina",Surname = "Klimko",     Nickname = "Serwolina",   ImagePath = "/images/karko.jpg",    EloSingles = 1000, EloDoubles = 1000 },
                new Player { PlayerId = 8, Name = "Hania",   Surname = "Stencel",    Nickname = "Hanula",      ImagePath = "/images/hania.jpg",    EloSingles = 1000, EloDoubles = 1000 }
            );
        }
    }
}
