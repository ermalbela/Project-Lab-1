using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using YourNamespace.Models;

namespace SecureWebSite.Server.Models
{
    public class Bus
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BusId { get; set; }

        [Required]
        [StringLength(15)]
        public string CompanyName { get; set; }

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
        public int BusCompanyId { get; set; }
        public BusCompany BusCompany { get; set; }
    }
}