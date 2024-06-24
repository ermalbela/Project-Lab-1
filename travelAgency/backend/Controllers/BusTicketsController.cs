using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureWebSite.Server.Data;
using Microsoft.AspNetCore.Authorization;
using SecureWebSite.Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using static SecureWebSite.Server.Controllers.FlightController;

namespace SecureWebSite.Server.Controllers
{
    [Route("api/bus_tickets")]
    [ApiController]
    [Authorize]

    public class BusTicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;

        public BusTicketsController(ApplicationDbContext context, UserManager<User> um)
        {
            _context = context;
            _userManager = um;
        }

        public class PurchaseBusRequest
        {
            public List<int> BusId { get; set; }
            public User User { get; set; }
            public int Adults { get; set; }
            public int Children { get; set; }
            public int Infant { get; set; }
            public string Category { get; set; }
            public DateTime Reservation { get; set; }
        }

        [HttpPost("purchase_bus_trip")]
        public async Task<ActionResult> PurchaseBusTrip(PurchaseBusRequest request)
        {
            int _busId = request.BusId[0];
            try
            {

                var existingUser = await _userManager.FindByIdAsync(request.User.Id);
                if (existingUser == null)
                {
                    return NotFound("User not found.");
                }

                var bus = await _context.BusTrips.FindAsync(_busId);

                if (bus == null)
                {
                    return NotFound(bus);
                }

                // Check if there are available tickets
                if (bus.TicketsAvailable <= 0)
                {
                    return BadRequest("No more tickets left for this bus trip.");
                }

                if (request.Adults <= 0)
                {
                    return BadRequest("There Should Be An Adult In The Bus Trip.");
                }

                var userHasTicket = await _context.BusTickets.AnyAsync(bt =>  bt.BusTrips.BusId == _busId && bt.Users.Any(u => u.Id == request.User.Id));

                if (userHasTicket)
                {
                    return BadRequest("User has already purchased a ticket for this bus trip.");
                }

                int totalTicketsSold = request.Adults + request.Children + request.Infant;
                bus.TicketsAvailable -= totalTicketsSold;


                var _busTicket = new BusTicket
                {
                    BusTrips = bus,
                    NumberOfAdults = request.Adults,
                    NumberOfInfants = request.Infant,
                    NumberOfChildren = request.Children,
                    ReservationDate = request.Reservation,
                };

                if (_busTicket.Users == null)
                {
                    _busTicket.Users = new List<User>(); // Initialize the list if null
                }

                _busTicket.Users.Add(existingUser);

                _context.BusTickets.Add(_busTicket);

                await _context.SaveChangesAsync();

                return Ok(new { message = "Bus Trip ticket purchased successfully.", _busTicket });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }

        }

        [HttpGet("get_purchased_bus_trips")]
        public async Task<ActionResult<IEnumerable<BusTicket>>> GetPurchasedBusTrips()
        {
            try
            {
                var busTickets = await _context.BusTickets.Select(b => new { b.NumberOfAdults, b.NumberOfChildren, b.BusTicketId, b.NumberOfInfants, b.ReservationDate, b.Users }).ToListAsync();


                return Ok(busTickets);

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong while fetching bus trips. " + ex.Message });

            }
        }

        // GET: api/BusTickets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BusTicket>> GetBusTicket(int id)
        {
            var busTicket = await _context.BusTickets.FindAsync(id);

            if (busTicket == null)
            {
                return NotFound();
            }

            return busTicket;
        }

    }
}
