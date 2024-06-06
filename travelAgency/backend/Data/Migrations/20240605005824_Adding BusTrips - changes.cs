using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecureWebSite.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddingBusTripschanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bus_BusCompanies_BusCompanyId",
                table: "Bus");

            migrationBuilder.DropForeignKey(
                name: "FK_BusTickets_Bus_BusId",
                table: "BusTickets");

            migrationBuilder.DropForeignKey(
                name: "FK_BusTrips_Bus_BusId",
                table: "BusTrips");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Bus",
                table: "Bus");

            migrationBuilder.RenameTable(
                name: "Bus",
                newName: "Buses");

            migrationBuilder.RenameIndex(
                name: "IX_Bus_BusCompanyId",
                table: "Buses",
                newName: "IX_Buses_BusCompanyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Buses",
                table: "Buses",
                column: "BusId");

            migrationBuilder.AddForeignKey(
                name: "FK_Buses_BusCompanies_BusCompanyId",
                table: "Buses",
                column: "BusCompanyId",
                principalTable: "BusCompanies",
                principalColumn: "BusCompanyId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BusTickets_Buses_BusId",
                table: "BusTickets",
                column: "BusId",
                principalTable: "Buses",
                principalColumn: "BusId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BusTrips_Buses_BusId",
                table: "BusTrips",
                column: "BusId",
                principalTable: "Buses",
                principalColumn: "BusId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Buses_BusCompanies_BusCompanyId",
                table: "Buses");

            migrationBuilder.DropForeignKey(
                name: "FK_BusTickets_Buses_BusId",
                table: "BusTickets");

            migrationBuilder.DropForeignKey(
                name: "FK_BusTrips_Buses_BusId",
                table: "BusTrips");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Buses",
                table: "Buses");

            migrationBuilder.RenameTable(
                name: "Buses",
                newName: "Bus");

            migrationBuilder.RenameIndex(
                name: "IX_Buses_BusCompanyId",
                table: "Bus",
                newName: "IX_Bus_BusCompanyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Bus",
                table: "Bus",
                column: "BusId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bus_BusCompanies_BusCompanyId",
                table: "Bus",
                column: "BusCompanyId",
                principalTable: "BusCompanies",
                principalColumn: "BusCompanyId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BusTickets_Bus_BusId",
                table: "BusTickets",
                column: "BusId",
                principalTable: "Bus",
                principalColumn: "BusId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BusTrips_Bus_BusId",
                table: "BusTrips",
                column: "BusId",
                principalTable: "Bus",
                principalColumn: "BusId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
