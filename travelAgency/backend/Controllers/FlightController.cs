using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureWebSite.Server.Data;
using SecureWebSite.Server.Data.Migrations;
using SecureWebSite.Server.Models;
using System.Numerics;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;

namespace SecureWebSite.Server.Controllers
{
    
    [Route("api/flights")]
    [ApiController]
    [Authorize]

    public class FlightController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;

        public FlightController(ApplicationDbContext context, UserManager<User> um)
        {
            _context = context;
            _userManager = um;
        }

        [HttpPost("create_flight")]
        public async Task<ActionResult> CreateFlight(Flight flight)
        {
            //int _planeId = flight.PlaneId[0];
            try
            {

                if (flight.PlaneId == 0)
                {
                    return BadRequest("Plane is required.");
                }

                var existingPlane = await _context.Planes.FindAsync(flight.PlaneId);
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

                if (existingPlane.Flights == null)
                {
                    existingPlane.Flights = new List<Flight>();
                }

                existingPlane.Flights.Add(_flight);

                // Add the flight object to the context
                _context.Flights.Add(_flight);

                // Save changes to the database
                await _context.SaveChangesAsync();

                var options = new JsonSerializerOptions
                {
                    ReferenceHandler = ReferenceHandler.Preserve
                };

                // Serialize the flightCompany object with configured options
                var json = JsonSerializer.Serialize(_flight, options);

                return Ok(json);
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

                var filtered_flights = await _context.Flights.Select(f => 
                    new { FlightCompany = f.Plane.FlightCompany.CompanyName, f.Plane, f.PlaneId, f.DestinationCountry, f.OriginCountry, f.Arrival, f.Departure, f.TicketPrice, f.TicketsLeft, f.FlightId, f.Reservation } )
                    .Where(f => f.DestinationCountry == flight.DestinationCountry && f.OriginCountry == flight.OriginCountry).ToListAsync();



                return Ok(new { filtered_flights });

            }
            catch (Exception ex)
            {
                return BadRequest("Something went wrong while filtering flights. " + ex.Message);
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
                return BadRequest(new { message = "Something went wrong while fetching flights. " + ex.Message });

            }
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

                var existingUser = await _userManager.FindByIdAsync(request.User.Id);
                if (existingUser == null)
                {
                    return NotFound("User not found.");
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

                var userHasTicket = await _context.FlightTickets.AnyAsync(ft => ft.Flight.FlightId == _flightId && ft.Users.Any(u => u.Id == request.User.Id));

                if (userHasTicket)
                {
                    return BadRequest("User has already purchased a ticket for this flight.");
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

                if (_flightTicket.Users == null)
                {
                    _flightTicket.Users = new List<User>(); // Initialize the list if null
                }

                _flightTicket.Users.Add(existingUser);

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

        [HttpGet("get_purchased_flights")]
        public async Task<ActionResult<IEnumerable<FlightTicket>>> GetPurchasedFlights()
        {
            try
            {
                var flightTickets = await _context.FlightTickets.Select(f => new { f.Adults, f.Category, f.Children, f.FlightTicketId, f.Infant, f.Reservation, f.Users }).ToListAsync();


                return Ok(flightTickets);

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong while fetching flights. " + ex.Message });

            }
        }


    }
}
