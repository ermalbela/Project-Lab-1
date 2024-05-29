using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecureWebSite.Server.Models
{
    public class FlightCompany
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FlightCompanyId { get; set; }

        [Required]
        [MaxLength(50)]
        public string CompanyName { get; set; }

        public ICollection<Plane>? Planes { get; set; }
    }
}