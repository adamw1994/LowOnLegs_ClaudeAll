using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LowOnLegs.Data.Migrations
{
    /// <inheritdoc />
    public partial class changeColumnNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Players_Player1Id",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Players_Player2Id",
                table: "Matches");

            migrationBuilder.RenameColumn(
                name: "Player2Id",
                table: "Matches",
                newName: "RightPlayerId");

            migrationBuilder.RenameColumn(
                name: "Player1Id",
                table: "Matches",
                newName: "LeftPlayerId");

            migrationBuilder.RenameIndex(
                name: "IX_Matches_Player2Id",
                table: "Matches",
                newName: "IX_Matches_RightPlayerId");

            migrationBuilder.RenameIndex(
                name: "IX_Matches_Player1Id",
                table: "Matches",
                newName: "IX_Matches_LeftPlayerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Players_LeftPlayerId",
                table: "Matches",
                column: "LeftPlayerId",
                principalTable: "Players",
                principalColumn: "PlayerId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Players_RightPlayerId",
                table: "Matches",
                column: "RightPlayerId",
                principalTable: "Players",
                principalColumn: "PlayerId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Players_LeftPlayerId",
                table: "Matches");

            migrationBuilder.DropForeignKey(
                name: "FK_Matches_Players_RightPlayerId",
                table: "Matches");

            migrationBuilder.RenameColumn(
                name: "RightPlayerId",
                table: "Matches",
                newName: "Player2Id");

            migrationBuilder.RenameColumn(
                name: "LeftPlayerId",
                table: "Matches",
                newName: "Player1Id");

            migrationBuilder.RenameIndex(
                name: "IX_Matches_RightPlayerId",
                table: "Matches",
                newName: "IX_Matches_Player2Id");

            migrationBuilder.RenameIndex(
                name: "IX_Matches_LeftPlayerId",
                table: "Matches",
                newName: "IX_Matches_Player1Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Players_Player1Id",
                table: "Matches",
                column: "Player1Id",
                principalTable: "Players",
                principalColumn: "PlayerId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_Players_Player2Id",
                table: "Matches",
                column: "Player2Id",
                principalTable: "Players",
                principalColumn: "PlayerId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
