using SecureWebSite.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YourNamespace.Models
{
    public class BusCompany
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BusCompanyId { get; set; }

        [Required]
        [StringLength(20)]
        public string Name { get; set; }

        public ICollection<Bus>? Buses { get; set; }
    }
}
