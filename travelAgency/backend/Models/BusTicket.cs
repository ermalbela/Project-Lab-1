﻿namespace SecureWebSite.Server.Models
{
    public class BusTicket
    {
        public int BusTicketId { get; set; }
        public DateTime Reservation { get; set; }
        public string Category { get; set; }
        public int Adults { get; set; }
        public int Children { get; set; }
        public int Infant { get; set; }
        public string UserId { get; set; }
        public int BusId { get; set; }
        public User User { get; set; }
        public Bus Bus { get; set; }
        //public ICollection<User> Users { get; set; }


    }
}
