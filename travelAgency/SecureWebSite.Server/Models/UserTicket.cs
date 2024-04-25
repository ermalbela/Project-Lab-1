namespace SecureWebSite.Server.Models
{
    public class UserTicket
    {
        public string Id { get; set; }
        public User User { get; set; }

        public int FlightId { get; set; }
        public FlightTicket FlightTicket { get; set; }
    }
}
