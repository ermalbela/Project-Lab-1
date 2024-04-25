using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureWebSite.Server.Data;
using SecureWebSite.Server.Models;

namespace SecureWebSite.Server.Controllers
{
    
    [Route("api/flights")]
    [ApiController]
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
                Flight _flight = new Flight()
                {
                    OriginCountry = flight.OriginCountry,
                    DestinationCountry = flight.DestinationCountry,
                    Reservation = flight.Reservation,
                    TicketsLeft = flight.TicketsLeft,
                    Departure = flight.Departure,
                    Arrival = flight.Arrival,
                    TicketPrice = flight.TicketPrice
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


    }

}
