using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureWebSite.Server.Data;
using SecureWebSite.Server.Data.Migrations;
using SecureWebSite.Server.Models;

namespace SecureWebSite.Server.Controllers
{
    
    [Route("api/bus")]
    [ApiController]
    [Authorize]

    public class BusController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BusController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("create_Bus")]
        public async Task<ActionResult> CreateBus(Bus bus)
        {

            try
            {
                Bus _bus = new Bus()
                {
                    OriginCountry = bus.OriginCountry,
                    DestinationCountry = bus.DestinationCountry,
                    Reservation = bus.Reservation,
                    TicketsLeft = bus.TicketsLeft,
                    Departure = bus.Departure,
                    Arrival = bus.Arrival,
                    TicketPrice = bus.TicketPrice
                };
                // Validate the Bus object if needed
                if (_bus == null)
                {
                    return BadRequest("Bus object is null.");
                }

                // Add the Bus object to the context
                _context.Buses.Add(_bus);

                // Save changes to the database
                await _context.SaveChangesAsync();

                return Ok(new {message = "Bus created successfully.", bus = _bus});
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to create Bus: {ex.Message}");
            }
        }

        [HttpPost("filtered_bus")]
        public async Task<ActionResult<IEnumerable<Bus>>> FilteredBus(Bus bus)
        {
            try
            {
                Bus _bus = new Bus()
                {
                    OriginCountry = bus.OriginCountry,
                    DestinationCountry = bus.DestinationCountry,
                    Reservation = bus.Reservation,
                };

                IQueryable<Bus> query = _context.Buses;

                if(!string.IsNullOrEmpty(_bus.OriginCountry) && !string.IsNullOrEmpty(_bus.DestinationCountry))
                {
                    query = query.Where(f => f.DestinationCountry == _bus.DestinationCountry && f.OriginCountry == _bus.OriginCountry);
                }

                var filtered_bus = query.ToListAsync();

                return Ok(new { filtered_bus });

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong while filtering buses. " + ex.Message });
            }
        }

        [HttpGet("get_bus")]
        public async Task<ActionResult<IEnumerable<Bus>>> GetBus()
        {
            try
            {
                var bus = await _context.Buses.ToListAsync();

                return Ok(bus);

            } catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong while fetching buses. " + ex.Message });

            }
        }



      /*  [HttpPost("test_number")]
        public IActionResult TestNumber([FromBody] List<int> _num)
        {
            Console.WriteLine("NUMBER --------------> " + _num[0]);
            
            return Ok( new { num = _num[0], _num });
        }

        public class PurchaseBusRequest
        {
            public List<int> FlightId { get; set; }
            public User User { get; set; }
            public int Adults { get; set; }
            public int Children { get; set; }
            public int Infant { get; set; }
            public string Category { get; set; }
            public DateTime Reservation { get; set; }
        }


        [HttpPost("purchase_flight")]
        public async Task<ActionResult> PurchaseFlight(PurchaseFlightRequest request)
        {
            int _flightId = request.FlightId[0];
            try
            {

                var existingUserTicket = await _context.FlightTickets.FirstOrDefaultAsync(ut => ut.UserId == request.User.Id);

                if (existingUserTicket != null)
                {
                    return BadRequest("User has already purchased a ticket.");
                }

                // Get the flight
                var flight = await _context.Flights.FindAsync(_flightId);

                if (flight == null)
                {
                    return NotFound(flight);
                }

                // Check if there are available tickets
                if (flight.TicketsLeft <= 0)
                {
                    return BadRequest("No more tickets left for this flight.");
                }

                if (request.Adults <= 0)
                {
                    return BadRequest("There Should Be An Adult In The Flight.");
                }

                // Decrease ticketsLeft count
                int totalTicketsSold = request.Adults + request.Children + request.Infant;
                flight.TicketsLeft -= totalTicketsSold;


                // Create a new UserTicket
                var _flightTicket = new FlightTicket
                {
                    User = await _context.Users.FindAsync(request.User.Id),
                    Flight = flight,
                    FlightId = _flightId,
                    Adults = request.Adults,
                    Category = request.Category,
                    Infant = request.Infant,
                    Children = request.Children,
                    Reservation = request.Reservation,
                    UserId = request.User.Id
                };


                // Add UserTicket to database
                _context.FlightTickets.Add(_flightTicket);

                // Save changes to the database
                await _context.SaveChangesAsync();

                return Ok(new { message = "Flight ticket purchased successfully.", _flightTicket });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }

        }*/


    }
}
