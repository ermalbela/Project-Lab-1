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

<<<<<<< HEAD
        //buses
			public DbSet<Bus> Buses { get; set; }
			public DbSet<BusCompany> BusCompanies { get; set; }
			public DbSet<BusTicket> BusTickets { get; set; }
=======
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
>>>>>>> 9f123d86578dec3920bebd0150cfb4c183fdbb77
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
		}
}
