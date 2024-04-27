using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecureWebSite.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class testingflightTickets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserTicket");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "FlightTickets",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_FlightTickets_FlightId",
                table: "FlightTickets",
                column: "FlightId");

            migrationBuilder.CreateIndex(
                name: "IX_FlightTickets_UserId",
                table: "FlightTickets",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_FlightTickets_AspNetUsers_UserId",
                table: "FlightTickets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FlightTickets_Flights_FlightId",
                table: "FlightTickets",
                column: "FlightId",
                principalTable: "Flights",
                principalColumn: "FlightId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FlightTickets_AspNetUsers_UserId",
                table: "FlightTickets");

            migrationBuilder.DropForeignKey(
                name: "FK_FlightTickets_Flights_FlightId",
                table: "FlightTickets");

            migrationBuilder.DropIndex(
                name: "IX_FlightTickets_FlightId",
                table: "FlightTickets");

            migrationBuilder.DropIndex(
                name: "IX_FlightTickets_UserId",
                table: "FlightTickets");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "FlightTickets",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateTable(
                name: "UserTicket",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FlightId = table.Column<int>(type: "int", nullable: false),
                    FlightTicketId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTicket", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserTicket_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserTicket_FlightTickets_FlightTicketId",
                        column: x => x.FlightTicketId,
                        principalTable: "FlightTickets",
                        principalColumn: "FlightTicketId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserTicket_FlightTicketId",
                table: "UserTicket",
                column: "FlightTicketId");

            migrationBuilder.CreateIndex(
                name: "IX_UserTicket_UserId",
                table: "UserTicket",
                column: "UserId");
        }
    }
}
