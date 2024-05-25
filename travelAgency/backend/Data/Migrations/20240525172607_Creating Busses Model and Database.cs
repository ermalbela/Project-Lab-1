using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecureWebSite.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class CreatingBussesModelandDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Buses",
                columns: table => new
                {
                    BusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OriginCountry = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DestinationCountry = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Reservation = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TicketsLeft = table.Column<int>(type: "int", nullable: false),
                    Departure = table.Column<TimeOnly>(type: "time", nullable: false),
                    Arrival = table.Column<TimeOnly>(type: "time", nullable: false),
                    TicketPrice = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Buses", x => x.BusId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Buses");
        }
    }
}
