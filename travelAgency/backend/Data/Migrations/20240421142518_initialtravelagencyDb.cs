using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecureWebSite.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class initialtravelagencyDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FlightId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.CreateTable(
                name: "Flights",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
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
                    table.PrimaryKey("PK_Flights", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_FlightId",
                table: "AspNetUsers",
                column: "FlightId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Flights_FlightId",
                table: "AspNetUsers",
                column: "FlightId",
                principalTable: "Flights",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Flights_FlightId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Flights");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_FlightId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "FlightId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "AspNetUsers");
        }
    }
}
