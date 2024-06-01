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

            // Configure relationships
            modelBuilder.Entity<Plane>()
                .HasOne(p => p.FlightCompany)
                .WithMany(fc => fc.Planes)
                .HasForeignKey(p => p.FlightCompanyId);

            modelBuilder.Entity<Flight>()
                .HasOne(f => f.Plane)
                .WithMany(p => p.Flights)
                .HasForeignKey(f => f.PlaneId);
        }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
		}
}
