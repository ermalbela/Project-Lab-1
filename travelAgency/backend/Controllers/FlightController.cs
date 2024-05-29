using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureWebSite.Server.Data;
using SecureWebSite.Server.Data.Migrations;
using SecureWebSite.Server.Models;

namespace SecureWebSite.Server.Controllers
{
    
    [Route("api/flights")]
    [ApiController]
    [Authorize]

    public class FlightController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FlightController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("create_flight")]
        public async Task<ActionResult> CreateFlight(Flight flight)
        {

            try
            {
                if (flight.Plane == null || flight.Plane.PlaneId == 0)
                {
                    return BadRequest("Plane is required.");
                }

                var existingPlane = await _context.Planes.FindAsync(flight.Plane.PlaneId);
                if (existingPlane == null)
                {
                    return NotFound("Plane not found.");
                }


                Flight _flight = new Flight()
                {
                    OriginCountry = flight.OriginCountry,
                    DestinationCountry = flight.DestinationCountry,
                    Reservation = flight.Reservation,
                    TicketsLeft = flight.TicketsLeft,
                    Departure = flight.Departure,
                    Arrival = flight.Arrival,
                    TicketPrice = flight.TicketPrice,
                    PlaneId = flight.PlaneId,
                    Plane = existingPlane
                };
                // Validate the flight object if needed
                if (_flight == null)
                {
                    return BadRequest("Flight object is null.");
                }

                // Add the flight object to the context
                _context.Flights.Add(_flight);

                // Save changes to the database
                await _context.SaveChangesAsync();

                return Ok(new {message = "Flight created successfully.", flight = _flight});
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to create flight: {ex.Message}");
            }
        }

        [HttpPost("filtered_flights")]
        public async Task<ActionResult<IEnumerable<Flight>>> FilteredFlights(Flight flight)
        {
            try
            {
                Flight _flight = new Flight()
                {
                    OriginCountry = flight.OriginCountry,
                    DestinationCountry = flight.DestinationCountry,
                    Reservation = flight.Reservation,
                };

                IQueryable<Flight> query = _context.Flights;

                if(!string.IsNullOrEmpty(_flight.OriginCountry) && !string.IsNullOrEmpty(_flight.DestinationCountry))
                {
                    query = query.Where(f => f.DestinationCountry == _flight.DestinationCountry && f.OriginCountry == _flight.OriginCountry);
                }

                var filtered_flights = query.ToListAsync();

                return Ok(new { filtered_flights });

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong while filtering flights. " + ex.Message });
            }
        }

        [HttpGet("get_flights")]
        public async Task<ActionResult<IEnumerable<Flight>>> GetFlights()
        {
            try
            {
                var flights = await _context.Flights.ToListAsync();

                return Ok(flights);

            } catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong while fetching users. " + ex.Message });

            }
        }


        [HttpPost("test_number")]
        public IActionResult TestNumber([FromBody] List<int> _num)
        {
            Console.WriteLine("NUMBER --------------> " + _num[0]);
            
            return Ok( new { num = _num[0], _num });
        }

        public class PurchaseFlightRequest
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
                    Flight = flight,
                    Adults = request.Adults,
                    Category = request.Category,
                    Infant = request.Infant,
                    Children = request.Children,
                    Reservation = request.Reservation,
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

        }


    }
}
