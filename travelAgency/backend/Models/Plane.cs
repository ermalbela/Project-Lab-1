using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecureWebSite.Server.Models
{
    public class Plane
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PlaneId { get; set; }

        [Required]
        [MaxLength(50)]
        public string PlaneNumber { get; set; }

        public int FlightCompanyId { get; set; }
        public FlightCompany? FlightCompany { get; set; }

        public ICollection<Flight>? Flights { get; set; }
    }
}
