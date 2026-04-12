using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LowOnLegs.Data.Migrations
{
    /// <inheritdoc />
    public partial class HaniaAndKarko : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Players",
                columns: new[] { "PlayerId", "CreatedAt", "DateOfBirth", "Email", "ImagePath", "Name", "Nickname", "Phone", "Surname", "UpdatedAt" },
                values: new object[,]
                {
                    { 7, null, null, null, "assets/images/karko.png", "Karolina", "Serwolina", null, "Klimko", null },
                    { 8, null, null, null, "assets/images/hania.png", "Hania", "Hanula", null, "Stencel", null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Players",
                keyColumn: "PlayerId",
                keyValue: 8);
        }
    }
}
