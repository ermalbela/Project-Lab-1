using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SecureWebSite.Server.Models;

namespace SecureWebSite.Server.Data
{
		public class ApplicationDbContext : IdentityDbContext<User>
		{
			public DbSet<Flight> Flights { get; set; }
			public DbSet<FlightTicket> FlightTickets { get; set; }
        
			public DbSet<Bus> Buses { get; set; }
			public DbSet<BusTicket> BusTickets { get; set; }
			public DbSet<FlightCompany> FlightCompanies { get; set; }
			public DbSet<Plane> Planes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Define the relationship between Plane and FlightCompany
            modelBuilder.Entity<Plane>()
                .HasOne(p => p.FlightCompany)
                .WithMany(fc => fc.Planes) // Assuming FlightCompany has a navigation property 'Planes'
                .HasForeignKey(p => p.FlightCompanyId);
        }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
		}
}
