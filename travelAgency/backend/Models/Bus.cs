using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SecureWebSite.Server.Models
{
    public class Bus
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BusId { get; set; }
        public string OriginCountry { get; set; } = "Kosova";
        public string DestinationCountry { get; set; } = "Albania";
        public DateTime Reservation { get; set; } = DateTime.Now;
        public int TicketsLeft { get; set; } = 0;
        public TimeOnly Departure { get; set; } = new TimeOnly(); //Default TimeOnly() is 00:00:00
        public TimeOnly Arrival { get; set; } = new TimeOnly();
        public float TicketPrice { get; set; } = 0.0f;
    }
}
