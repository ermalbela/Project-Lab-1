using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecureWebSite.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class testdb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserTickets_AspNetUsers_UserId",
                table: "UserTickets");

            migrationBuilder.DropForeignKey(
                name: "FK_UserTickets_FlightTickets_FlightTicketId",
                table: "UserTickets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserTickets",
                table: "UserTickets");

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
                name: "Returning",
                table: "FlightTickets");

            migrationBuilder.DropColumn(
                name: "TicketPrice",
                table: "FlightTickets");

            migrationBuilder.RenameTable(
                name: "UserTickets",
                newName: "UserTicket");

            migrationBuilder.RenameColumn(
                name: "TicketsLeft",
                table: "FlightTickets",
                newName: "FlightId");

            migrationBuilder.RenameColumn(
                name: "OriginCountry",
                table: "FlightTickets",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserTickets_UserId",
                table: "UserTicket",
                newName: "IX_UserTicket_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserTickets_FlightTicketId",
                table: "UserTicket",
                newName: "IX_UserTicket_FlightTicketId");

            migrationBuilder.AddColumn<int>(
                name: "FlightTicketId",
                table: "Flights",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FlightTicketId",
                table: "UserTicket",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserTicket",
                table: "UserTicket",
                column: "Id");

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
                name: "FK_UserTicket_AspNetUsers_UserId",
                table: "UserTicket",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserTicket_FlightTickets_FlightTicketId",
                table: "UserTicket",
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

            migrationBuilder.DropForeignKey(
                name: "FK_UserTicket_AspNetUsers_UserId",
                table: "UserTicket");

            migrationBuilder.DropForeignKey(
                name: "FK_UserTicket_FlightTickets_FlightTicketId",
                table: "UserTicket");

            migrationBuilder.DropIndex(
                name: "IX_Flights_FlightTicketId",
                table: "Flights");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserTicket",
                table: "UserTicket");

            migrationBuilder.DropColumn(
                name: "FlightTicketId",
                table: "Flights");

            migrationBuilder.RenameTable(
                name: "UserTicket",
                newName: "UserTickets");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "FlightTickets",
                newName: "OriginCountry");

            migrationBuilder.RenameColumn(
                name: "FlightId",
                table: "FlightTickets",
                newName: "TicketsLeft");

            migrationBuilder.RenameIndex(
                name: "IX_UserTicket_UserId",
                table: "UserTickets",
                newName: "IX_UserTickets_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserTicket_FlightTicketId",
                table: "UserTickets",
                newName: "IX_UserTickets_FlightTicketId");

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

            migrationBuilder.AddColumn<DateTime>(
                name: "Returning",
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

            migrationBuilder.AlterColumn<int>(
                name: "FlightTicketId",
                table: "UserTickets",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserTickets",
                table: "UserTickets",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserTickets_AspNetUsers_UserId",
                table: "UserTickets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserTickets_FlightTickets_FlightTicketId",
                table: "UserTickets",
                column: "FlightTicketId",
                principalTable: "FlightTickets",
                principalColumn: "FlightTicketId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
