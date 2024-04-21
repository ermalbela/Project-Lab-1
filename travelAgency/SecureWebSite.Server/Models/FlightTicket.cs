namespace SecureWebSite.Server.Models
{
    public class FlightTicket
    {
        public int FlightTicketId { get; set; }
        public string OriginCountry { get; set; } = "Kosovo";
        public string DestinationCountry { get; set; } = "Albania";
        public DateTime Reservation { get; set; } = DateTime.Now;
        public DateTime Returning { get; set; } = DateTime.Now;
        public string Category { get; set; } = "Standard";
        public int Adults { get; set; } = 0;
        public int Children { get; set; } = 0;
        public int Infant { get; set; } = 0;
        public int TicketsLeft { get; set; } = 0;
        public TimeOnly Departure { get; set; } = new TimeOnly(); //Default TimeOnly() is 00:00:00
        public TimeOnly Arrival { get; set; } = new TimeOnly();
        public float TicketPrice { get; set; } = 0.0f;
        public ICollection<User> Users { get; set; }
    }
}
