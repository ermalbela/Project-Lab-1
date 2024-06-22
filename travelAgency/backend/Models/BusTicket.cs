using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SecureWebSite.Server.Models
{
    public class BusTicket
    {
        [Key]
        public int BusTicketId { get; set; }

        [Required]
        public DateTime ReservationDate { get; set; }

        [Required]
        public int NumberOfAdults { get; set; }

        [Required]
        public int NumberOfChildren { get; set; }

        [Required]
        public int NumberOfInfants { get; set; }
        
        public BusTrips BusTrips { get; set; }

        [JsonIgnore]
        public ICollection<User> Users { get; set; }
    }
}
