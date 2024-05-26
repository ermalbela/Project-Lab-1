﻿namespace SecureWebSite.Server.Models
{
    public class FlightTicket
    {
        public int FlightTicketId { get; set; }
        public DateTime Reservation { get; set; }
        public string Category { get; set; }
        public int Adults { get; set; }
        public int Children { get; set; }
        public int Infant { get; set; }
        public string UserId { get; set; }
        public int FlightId { get; set; }
        public User User { get; set; }
        public Flight Flight { get; set; }
        public ICollection<Flight> Flights { get; set; }
    }
}