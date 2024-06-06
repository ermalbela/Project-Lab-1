using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecureWebSite.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddingBusTrips : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Buses_BusCompanies_BusCompanyId",
                table: "Buses");

            migrationBuilder.DropForeignKey(
                name: "FK_BusTickets_AspNetUsers_UserId",
                table: "BusTickets");

            migrationBuilder.DropForeignKey(
                name: "FK_BusTickets_Buses_BusId",
                table: "BusTickets");

            migrationBuilder.DropIndex(
                name: "IX_BusTickets_UserId",
                table: "BusTickets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Buses",
                table: "Buses");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "BusTickets");

            migrationBuilder.DropColumn(
                name: "ArrivalTime",
                table: "Buses");

            migrationBuilder.DropColumn(
                name: "DepartureTime",
                table: "Buses");

            migrationBuilder.DropColumn(
                name: "Destination",
                table: "Buses");

            migrationBuilder.DropColumn(
                name: "Origin",
                table: "Buses");

            migrationBuilder.DropColumn(
                name: "TicketPrice",
                table: "Buses");

            migrationBuilder.RenameTable(
                name: "Buses",
                newName: "Bus");

            migrationBuilder.RenameColumn(
                name: "TicketsAvailable",
                table: "Bus",
                newName: "DeckersNr");

            migrationBuilder.RenameIndex(
                name: "IX_Buses_BusCompanyId",
                table: "Bus",
                newName: "IX_Bus_BusCompanyId");

            migrationBuilder.AddColumn<int>(
                name: "BusTicketId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BusNumber",
                table: "Bus",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Bus",
                table: "Bus",
                column: "BusId");

            migrationBuilder.CreateTable(
                name: "BusTrips",
                columns: table => new
                {
                    BusTripsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Origin = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Destination = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TicketsAvailable = table.Column<int>(type: "int", nullable: false),
                    DepartureTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    ArrivalTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    TicketPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BusId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusTrips", x => x.BusTripsId);
                    table.ForeignKey(
                        name: "FK_BusTrips_Bus_BusId",
                        column: x => x.BusId,
                        principalTable: "Bus",
                        principalColumn: "BusId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_BusTicketId",
                table: "AspNetUsers",
                column: "BusTicketId");

            migrationBuilder.CreateIndex(
                name: "IX_BusTrips_BusId",
                table: "BusTrips",
                column: "BusId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_BusTickets_BusTicketId",
                table: "AspNetUsers",
                column: "BusTicketId",
                principalTable: "BusTickets",
                principalColumn: "BusTicketId");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_BusTickets_BusTicketId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Bus_BusCompanies_BusCompanyId",
                table: "Bus");

            migrationBuilder.DropForeignKey(
                name: "FK_BusTickets_Bus_BusId",
                table: "BusTickets");

            migrationBuilder.DropTable(
                name: "BusTrips");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_BusTicketId",
                table: "AspNetUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Bus",
                table: "Bus");

            migrationBuilder.DropColumn(
                name: "BusTicketId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "BusNumber",
                table: "Bus");

            migrationBuilder.RenameTable(
                name: "Bus",
                newName: "Buses");

            migrationBuilder.RenameColumn(
                name: "DeckersNr",
                table: "Buses",
                newName: "TicketsAvailable");

            migrationBuilder.RenameIndex(
                name: "IX_Bus_BusCompanyId",
                table: "Buses",
                newName: "IX_Buses_BusCompanyId");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "BusTickets",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "ArrivalTime",
                table: "Buses",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<TimeSpan>(
                name: "DepartureTime",
                table: "Buses",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<string>(
                name: "Destination",
                table: "Buses",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Origin",
                table: "Buses",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "TicketPrice",
                table: "Buses",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Buses",
                table: "Buses",
                column: "BusId");

            migrationBuilder.CreateIndex(
                name: "IX_BusTickets_UserId",
                table: "BusTickets",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Buses_BusCompanies_BusCompanyId",
                table: "Buses",
                column: "BusCompanyId",
                principalTable: "BusCompanies",
                principalColumn: "BusCompanyId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BusTickets_AspNetUsers_UserId",
                table: "BusTickets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

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
