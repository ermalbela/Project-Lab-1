using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecureWebSite.Server.Models
{
        public class User : IdentityUser
        {

                [MaxLength(50)]
                public string Name { get; set; }

                [Column(TypeName ="datetime")]
                public DateTime CreatedDate { get; set; } = DateTime.Now;

                [Column(TypeName = "datetime")]
                public DateTime ModifiedDate { get; set; } = DateTime.Now;

                [Column(TypeName = "datetime")]
                public DateTime LastLogin { get; set; } = DateTime.Now;

                public string? Role { get; set; }

                public int? FlightTicketId { get; set; }  // Nullable FK
                [ForeignKey("FlightTicketId")]
                public FlightTicket? FlightTicket { get; set; }

                public int? BusTicketId { get; set; }  // Nullable FK for BusTicket if similar
                [ForeignKey("BusTicketId")]
                public BusTicket? BusTicket { get; set; }

    }
}