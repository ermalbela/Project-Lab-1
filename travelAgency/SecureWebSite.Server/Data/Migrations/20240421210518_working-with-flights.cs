using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecureWebSite.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class workingwithflights : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Adults",
                table: "Flights");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Flights");

            migrationBuilder.DropColumn(
                name: "Children",
                table: "Flights");

            migrationBuilder.DropColumn(
                name: "Infant",
                table: "Flights");

            migrationBuilder.DropColumn(
                name: "Returning",
                table: "Flights");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Adults",
                table: "Flights",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Flights",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Children",
                table: "Flights",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Infant",
                table: "Flights",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "Returning",
                table: "Flights",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
