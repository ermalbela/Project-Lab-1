using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecureWebSite.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class Flights_Update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Flights_FlightId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_FlightId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "FlightId",
                table: "AspNetUsers");

            migrationBuilder.CreateTable(
                name: "FlightTickets",
                columns: table => new
                {
                    FlightTicketId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OriginCountry = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DestinationCountry = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Reservation = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Returning = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adults = table.Column<int>(type: "int", nullable: false),
                    Children = table.Column<int>(type: "int", nullable: false),
                    Infant = table.Column<int>(type: "int", nullable: false),
                    TicketsLeft = table.Column<int>(type: "int", nullable: false),
                    Departure = table.Column<TimeOnly>(type: "time", nullable: false),
                    Arrival = table.Column<TimeOnly>(type: "time", nullable: false),
                    TicketPrice = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlightTickets", x => x.FlightTicketId);
                });

            migrationBuilder.CreateTable(
                name: "UserTickets",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FlightId = table.Column<int>(type: "int", nullable: false),
                    FlightTicketId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTickets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserTickets_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserTickets_FlightTickets_FlightTicketId",
                        column: x => x.FlightTicketId,
                        principalTable: "FlightTickets",
                        principalColumn: "FlightTicketId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserTickets_FlightTicketId",
                table: "UserTickets",
                column: "FlightTicketId");

            migrationBuilder.CreateIndex(
                name: "IX_UserTickets_UserId",
                table: "UserTickets",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserTickets");

            migrationBuilder.DropTable(
                name: "FlightTickets");

            migrationBuilder.AddColumn<int>(
                name: "FlightId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_FlightId",
                table: "AspNetUsers",
                column: "FlightId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Flights_FlightId",
                table: "AspNetUsers",
                column: "FlightId",
                principalTable: "Flights",
                principalColumn: "FlightId");
        }
    }
}
