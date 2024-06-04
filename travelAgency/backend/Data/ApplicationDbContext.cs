using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SecureWebSite.Server.Models;
using YourNamespace.Models;

namespace SecureWebSite.Server.Data
{
		public class ApplicationDbContext : IdentityDbContext<User>
		{
			public DbSet<Flight> Flights { get; set; }
			public DbSet<FlightTicket> FlightTickets { get; set; }
        
			
			public DbSet<FlightCompany> FlightCompanies { get; set; }
			public DbSet<Plane> Planes { get; set; }

        //buses
			public DbSet<Bus> Buses { get; set; }
			public DbSet<BusCompany> BusCompanies { get; set; }
			public DbSet<BusTicket> BusTickets { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
		}
}
