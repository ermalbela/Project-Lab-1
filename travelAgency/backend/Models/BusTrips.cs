using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using YourNamespace.Models;

namespace SecureWebSite.Server.Models
{
    public class BusTrips
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BusTripsId { get; set; }

    

        [Required]
        [StringLength(20)]
        public string Origin { get; set; }

        [Required]
        [StringLength(20)]
        public string Destination { get; set; }

        [Required]
        public int TicketsAvailable { get; set; }

        [Required]
        public TimeSpan DepartureTime { get; set; }

        [Required]
        public TimeSpan ArrivalTime { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TicketPrice { get; set; }

        [ForeignKey("BusCompany")]
        public int BusId { get; set; }
        public Bus Bus{ get; set; }
       
    }
}