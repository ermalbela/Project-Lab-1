using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SecureWebSite.Server.Data;
using SecureWebSite.Server.Models;
using System.Text.Json.Serialization;
using System.Text.Json;

namespace api.Controllers
{
    [Route("api/offers")]
    [ApiController]
    [Authorize]
    public class OffersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly IWebHostEnvironment _hostEnvironment;

        public OffersController(ApplicationDbContext context, UserManager<User> userManager, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _userManager = userManager;
            this._hostEnvironment = hostEnvironment;
        }

        [HttpPost("create_offer")]
        public async Task<ActionResult> CreateOffer([FromForm] Offer offer)
        {
            try
            {

                var existingOffer = await _context.Offers.FindAsync(offer.OfferId);
                offer.ImageName = await SaveImage(offer.ImageFile);

                Offer _offer = new Offer()
                {
                    Price = offer.Price,
                    OriginCountry = offer.OriginCountry,
                    DestinationCountry = offer.DestinationCountry,
                };

                if (_offer == null)
                {
                    return BadRequest("Offer object is null");
                }

                if (existingOffer == null)
                {
                    _context.Offers.Add(offer);  // Add new offer
                }

                var options = new JsonSerializerOptions
                {
                    ReferenceHandler = ReferenceHandler.Preserve
                };

                // Serialize the flightCompany object with configured options
                var json = JsonSerializer.Serialize(_offer, options);

                await _context.SaveChangesAsync();

                return Ok(json);

            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to create offer: {ex.Message}");
            }
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ', '-');
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(imageFile.FileName);
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);
            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }
            return imageName;
        }
    }
}
