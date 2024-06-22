using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecureWebSite.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class BusTicketChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BusTickets_Buses_BusId",
                table: "BusTickets");

            migrationBuilder.RenameColumn(
                name: "BusId",
                table: "BusTickets",
                newName: "BusTripsId");

            migrationBuilder.RenameIndex(
                name: "IX_BusTickets_BusId",
                table: "BusTickets",
                newName: "IX_BusTickets_BusTripsId");

            migrationBuilder.AddForeignKey(
                name: "FK_BusTickets_BusTrips_BusTripsId",
                table: "BusTickets",
                column: "BusTripsId",
                principalTable: "BusTrips",
                principalColumn: "BusTripsId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BusTickets_BusTrips_BusTripsId",
                table: "BusTickets");

            migrationBuilder.RenameColumn(
                name: "BusTripsId",
                table: "BusTickets",
                newName: "BusId");

            migrationBuilder.RenameIndex(
                name: "IX_BusTickets_BusTripsId",
                table: "BusTickets",
                newName: "IX_BusTickets_BusId");

            migrationBuilder.AddForeignKey(
                name: "FK_BusTickets_Buses_BusId",
                table: "BusTickets",
                column: "BusId",
                principalTable: "Buses",
                principalColumn: "BusId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
