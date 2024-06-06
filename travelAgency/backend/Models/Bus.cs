using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using YourNamespace.Models;

namespace SecureWebSite.Server.Models
{
    public class Bus
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BusId { get; set; }

        [Required]
        [MaxLength(50)]
        public string BusNumber { get; set; }
       
        [Required]
        public int DeckersNr { get; set; }
        

        public int BusCompanyId { get; set; }
        public BusCompany? BusCompany { get; set; }

        [JsonIgnore]
        public ICollection<BusTrips>? BusTrips { get; set; }
    }
}
