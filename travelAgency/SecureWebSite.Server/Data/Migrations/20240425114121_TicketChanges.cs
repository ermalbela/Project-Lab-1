using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecureWebSite.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class TicketChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Arrival",
                table: "FlightTickets");

            migrationBuilder.DropColumn(
                name: "Departure",
                table: "FlightTickets");

            migrationBuilder.DropColumn(
                name: "DestinationCountry",
                table: "FlightTickets");

            migrationBuilder.DropColumn(
                name: "OriginCountry",
                table: "FlightTickets");

            migrationBuilder.DropColumn(
                name: "Reservation",
                table: "FlightTickets");

            migrationBuilder.DropColumn(
                name: "TicketPrice",
                table: "FlightTickets");

            migrationBuilder.DropColumn(
                name: "TicketsLeft",
                table: "FlightTickets");

            migrationBuilder.AddColumn<int>(
                name: "FlightTicketId",
                table: "Flights",
                type: "int",
                nullable: true);

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Flights_FlightTickets_FlightTicketId",
                table: "Flights");

            migrationBuilder.DropIndex(
                name: "IX_Flights_FlightTicketId",
                table: "Flights");

            migrationBuilder.DropColumn(
                name: "FlightTicketId",
                table: "Flights");

            migrationBuilder.AddColumn<TimeOnly>(
                name: "Arrival",
                table: "FlightTickets",
                type: "time",
                nullable: false,
                defaultValue: new TimeOnly(0, 0, 0));

            migrationBuilder.AddColumn<TimeOnly>(
                name: "Departure",
                table: "FlightTickets",
                type: "time",
                nullable: false,
                defaultValue: new TimeOnly(0, 0, 0));

            migrationBuilder.AddColumn<string>(
                name: "DestinationCountry",
                table: "FlightTickets",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OriginCountry",
                table: "FlightTickets",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "Reservation",
                table: "FlightTickets",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<float>(
                name: "TicketPrice",
                table: "FlightTickets",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<int>(
                name: "TicketsLeft",
                table: "FlightTickets",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
