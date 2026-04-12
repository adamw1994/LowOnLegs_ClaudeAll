using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LowOnLegs.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDoubleMatchesAndElo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EloDoubles",
                table: "Players",
                type: "INTEGER",
                nullable: false,
                defaultValue: 1000);

            migrationBuilder.AddColumn<int>(
                name: "EloSingles",
                table: "Players",
                type: "INTEGER",
                nullable: false,
                defaultValue: 1000);

            migrationBuilder.CreateTable(
                name: "DoubleMatches",
                columns: table => new
                {
                    DoubleMatchId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LeftPlayer1Id = table.Column<int>(type: "INTEGER", nullable: true),
                    LeftPlayer2Id = table.Column<int>(type: "INTEGER", nullable: true),
                    RightPlayer1Id = table.Column<int>(type: "INTEGER", nullable: true),
                    RightPlayer2Id = table.Column<int>(type: "INTEGER", nullable: true),
                    LeftTeamScore = table.Column<int>(type: "INTEGER", nullable: false),
                    RightTeamScore = table.Column<int>(type: "INTEGER", nullable: false),
                    LeftTeamWon = table.Column<bool>(type: "INTEGER", nullable: true),
                    StartTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndTime = table.Column<DateTime>(type: "TEXT", nullable: true),
                    IsFinished = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoubleMatches", x => x.DoubleMatchId);
                    table.ForeignKey(
                        name: "FK_DoubleMatches_Players_LeftPlayer1Id",
                        column: x => x.LeftPlayer1Id,
                        principalTable: "Players",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DoubleMatches_Players_LeftPlayer2Id",
                        column: x => x.LeftPlayer2Id,
                        principalTable: "Players",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DoubleMatches_Players_RightPlayer1Id",
                        column: x => x.RightPlayer1Id,
                        principalTable: "Players",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DoubleMatches_Players_RightPlayer2Id",
                        column: x => x.RightPlayer2Id,
                        principalTable: "Players",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 1,
                columns: new[] { "EloDoubles", "EloSingles", "ImagePath" },
                values: new object[] { 1000, 1000, "/images/klimko.png" });

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 2,
                columns: new[] { "EloDoubles", "EloSingles", "ImagePath" },
                values: new object[] { 1000, 1000, "/images/igor.png" });

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 3,
                columns: new[] { "EloDoubles", "EloSingles", "ImagePath" },
                values: new object[] { 1000, 1000, "/images/kuba.png" });

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 4,
                columns: new[] { "EloDoubles", "EloSingles", "ImagePath" },
                values: new object[] { 1000, 1000, "/images/braciak.png" });

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 5,
                columns: new[] { "EloDoubles", "EloSingles", "ImagePath" },
                values: new object[] { 1000, 1000, "/images/gliwa.png" });

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 6,
                columns: new[] { "EloDoubles", "EloSingles", "ImagePath" },
                values: new object[] { 1000, 1000, "/images/fred.png" });

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 7,
                columns: new[] { "EloDoubles", "EloSingles", "ImagePath" },
                values: new object[] { 1000, 1000, "/images/karko.jpg" });

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 8,
                columns: new[] { "EloDoubles", "EloSingles", "ImagePath" },
                values: new object[] { 1000, 1000, "/images/hania.jpg" });

            migrationBuilder.CreateIndex(
                name: "IX_DoubleMatches_LeftPlayer1Id",
                table: "DoubleMatches",
                column: "LeftPlayer1Id");

            migrationBuilder.CreateIndex(
                name: "IX_DoubleMatches_LeftPlayer2Id",
                table: "DoubleMatches",
                column: "LeftPlayer2Id");

            migrationBuilder.CreateIndex(
                name: "IX_DoubleMatches_RightPlayer1Id",
                table: "DoubleMatches",
                column: "RightPlayer1Id");

            migrationBuilder.CreateIndex(
                name: "IX_DoubleMatches_RightPlayer2Id",
                table: "DoubleMatches",
                column: "RightPlayer2Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DoubleMatches");

            migrationBuilder.DropColumn(
                name: "EloDoubles",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "EloSingles",
                table: "Players");

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 1,
                column: "ImagePath",
                value: "assets/images/klimko.png");

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 2,
                column: "ImagePath",
                value: "assets/images/igor.png");

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 3,
                column: "ImagePath",
                value: "assets/images/kuba.png");

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 4,
                column: "ImagePath",
                value: "assets/images/braciak.png");

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 5,
                column: "ImagePath",
                value: "assets/images/gliwa.png");

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 6,
                column: "ImagePath",
                value: "assets/images/fred.png");

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 7,
                column: "ImagePath",
                value: "assets/images/karko.png");

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 8,
                column: "ImagePath",
                value: "assets/images/hania.png");
        }
    }
}
