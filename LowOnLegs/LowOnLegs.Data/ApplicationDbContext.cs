using LowOnLegs.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LowOnLegs.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        {
        }

        public DbSet<Player> Players { get; set; }
        public DbSet<Match> Matches { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Konfiguracja tabeli Player
            modelBuilder.Entity<Player>(entity =>
            {
                entity.HasKey(e => e.PlayerId);

                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.Surname).IsRequired();
                entity.Property(e => e.Nickname).IsRequired();
                entity.Property(e => e.Email).IsRequired(false);
                entity.Property(e => e.CreatedAt).IsRequired(false);
                entity.Property(e => e.UpdatedAt).IsRequired(false);
            });

            // Konfiguracja tabeli Match
            modelBuilder.Entity<Match>(entity =>
            {
                entity.HasKey(e => e.MatchId);

                entity.Property(e => e.StartTime).IsRequired();
                entity.Property(e => e.IsFinished).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt).IsRequired();

                // Relacja Match -> Player1 (wiele do jednego)
                entity.HasOne(m => m.LeftPlayer)
                      .WithMany(p => p.Matches)
                      .HasForeignKey(m => m.LeftPlayerId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Relacja Match -> Player2 (wiele do jednego)
                entity.HasOne(m => m.RightPlayer)
                      .WithMany()
                      .HasForeignKey(m => m.RightPlayerId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Relacja Match -> Winner (wiele do jednego)
                entity.HasOne(m => m.Winner)
                      .WithMany(p => p.MatchesWon)
                      .HasForeignKey(m => m.WinnerId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Player>().HasData(
        new Player
        {
            PlayerId = 1,
            Name = "Piotr",
            Surname = "Klimkowski",
            Nickname = "Klimko",
            ImagePath = "assets/images/klimko.png",
        },
        new Player
        {
            PlayerId = 2,
            Name = "Igor",
            Surname = "Gresista",
            Nickname = "Igorakowiec",
            ImagePath = "assets/images/igor.png",
        },
        new Player
        {
            PlayerId = 3,
            Name = "Jakub",
            Surname = "Stadniczuk",
            Nickname = "Kuba",
            ImagePath = "assets/images/kuba.png",
        },
        new Player
        {
            PlayerId = 4,
            Name = "Dawid",
            Surname = "Posała",
            Nickname = "Braciak",
            ImagePath = "assets/images/braciak.png",
        },
        new Player
        {
            PlayerId = 5,
            Name = "Michał",
            Surname = "Gliwa",
            Nickname = "Gliwa",
            ImagePath = "assets/images/gliwa.png",
        },
        new Player
        {
            PlayerId = 6,
            Name = "Adam",
            Surname = "Wybraniec",
            Nickname = "Fred",
            ImagePath = "assets/images/fred.png",
        },
        new Player
        {
            PlayerId = 7,
            Name = "Karolina",
            Surname = "Klimko",
            Nickname = "Serwolina",
            ImagePath = "assets/images/karko.png",
        }, new Player
        {
            PlayerId = 8,
            Name = "Hania",
            Surname = "Stencel",
            Nickname = "Hanula",
            ImagePath = "assets/images/hania.png",
        }
    );

        }
    }
}
