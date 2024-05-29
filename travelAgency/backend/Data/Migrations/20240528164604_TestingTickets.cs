using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecureWebSite.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class TestingTickets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Flights_FlightTickets_FlightTicketId",
                table: "Flights");

            migrationBuilder.DropForeignKey(
                name: "FK_FlightTickets_AspNetUsers_UserId",
                table: "FlightTickets");

            migrationBuilder.DropIndex(
                name: "IX_FlightTickets_UserId",
                table: "FlightTickets");

            migrationBuilder.DropIndex(
                name: "IX_Flights_FlightTicketId",
                table: "Flights");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "FlightTickets");

            migrationBuilder.DropColumn(
                name: "FlightTicketId",
                table: "Flights");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Flights");

            migrationBuilder.AddColumn<int>(
                name: "PlaneId",
                table: "Flights",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FlightTicketId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FlightCompanies",
                columns: table => new
                {
                    FlightCompanyId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlightCompanies", x => x.FlightCompanyId);
                });

            migrationBuilder.CreateTable(
                name: "Planes",
                columns: table => new
                {
                    PlaneId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlaneNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FlightCompanyId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Planes", x => x.PlaneId);
                    table.ForeignKey(
                        name: "FK_Planes_FlightCompanies_FlightCompanyId",
                        column: x => x.FlightCompanyId,
                        principalTable: "FlightCompanies",
                        principalColumn: "FlightCompanyId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Flights_PlaneId",
                table: "Flights",
                column: "PlaneId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_FlightTicketId",
                table: "AspNetUsers",
                column: "FlightTicketId");

            migrationBuilder.CreateIndex(
                name: "IX_Planes_FlightCompanyId",
                table: "Planes",
                column: "FlightCompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_FlightTickets_FlightTicketId",
                table: "AspNetUsers",
                column: "FlightTicketId",
                principalTable: "FlightTickets",
                principalColumn: "FlightTicketId");

            migrationBuilder.AddForeignKey(
                name: "FK_Flights_Planes_PlaneId",
                table: "Flights",
                column: "PlaneId",
                principalTable: "Planes",
                principalColumn: "PlaneId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_FlightTickets_FlightTicketId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Flights_Planes_PlaneId",
                table: "Flights");

            migrationBuilder.DropTable(
                name: "Planes");

            migrationBuilder.DropTable(
                name: "FlightCompanies");

            migrationBuilder.DropIndex(
                name: "IX_Flights_PlaneId",
                table: "Flights");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_FlightTicketId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PlaneId",
                table: "Flights");

            migrationBuilder.DropColumn(
                name: "FlightTicketId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "FlightTickets",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "FlightTicketId",
                table: "Flights",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Flights",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_FlightTickets_UserId",
                table: "FlightTickets",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Flights_FlightTicketId",
                table: "Flights",
                column: "FlightTicketId");

            migrationBuilder.AddForeignKey(
                name: "FK_Flights_FlightTickets_FlightTicketId",
                table: "Flights",
                column: "FlightTicketId",
                principalTable: "FlightTickets",
                principalColumn: "FlightTicketId");

            migrationBuilder.AddForeignKey(
                name: "FK_FlightTickets_AspNetUsers_UserId",
                table: "FlightTickets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
