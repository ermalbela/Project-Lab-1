using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{

    public class Offer
    {
        [Key]
        public int OfferId { get; set; }
        public float Price { get; set; }
        public string OriginCountry { get; set; }
        public string DestinationCountry { get; set; }
        public DateTime Reservation { get; set; }
        
        public string ImageName { get; set; }

        [NotMapped]
        public IFormFile ImageFile { get; set; }

        [NotMapped]
        public string ImageSource { get; set; }

    }
}
