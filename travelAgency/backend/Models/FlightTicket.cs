namespace SecureWebSite.Server.Models
{
    public class FlightTicket
    {
        public int FlightTicketId { get; set; }
        public DateTime Reservation { get; set; }
        public string Category { get; set; }
        public int Adults { get; set; }
        public int Children { get; set; }
        public int Infant { get; set; }
        public Flight Flight { get; set; }
        public ICollection<User> Users { get; set; }
    }
}
