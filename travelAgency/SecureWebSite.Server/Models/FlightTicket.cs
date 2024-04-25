namespace SecureWebSite.Server.Models
{
    public class FlightTicket
    {
        public int FlightTicketId { get; set; }
        public DateTime Reservation { get; set; } = DateTime.Now;
        public string Category { get; set; } = "Standard";
        public int Adults { get; set; } = 0;
        public int Children { get; set; } = 0;
        public int Infant { get; set; } = 0;
        public ICollection<UserTicket> UserTickets { get; set; }
        public ICollection<Flight> Flights { get; set; }
    }
}
