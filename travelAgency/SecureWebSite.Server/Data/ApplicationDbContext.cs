using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SecureWebSite.Server.Models;

namespace SecureWebSite.Server.Data
{
		public class ApplicationDbContext : IdentityDbContext<User>
		{
			public DbSet<Flight> Flights { get; set; }
			public DbSet<FlightTicket> FlightTickets { get; set; }
			public DbSet<UserTicket> UserTickets { get; set; }
			public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
		}
}
