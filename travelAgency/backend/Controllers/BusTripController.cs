using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureWebSite.Server.Data;
using Microsoft.AspNetCore.Authorization;
using SecureWebSite.Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SecureWebSite.Server.Controllers
{
    [Route("api/buses")]
    [ApiController]
    [Authorize]

    public class BusesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BusesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Buses
        [HttpPost("filtered_buses")]
        public async Task<ActionResult<IEnumerable<BusTrips>>> FilteredFlights(BusTrips busTrip)
        {
            try
            {

                var filtered_buses = await _context.BusTrips.Select(b =>
                    new { BusCompany = b.Bus.BusCompany.Name, b.Bus, b.BusId, b.Destination, b.Origin, b.ArrivalTime, b.DepartureTime, b.TicketPrice, b.TicketsAvailable, b.BusTripsId, b.Reservation })
                    .Where(b => b.Destination == busTrip.Destination && b.Origin == busTrip.Origin).ToListAsync();



                return Ok(new { filtered_buses });

            }
            catch (Exception ex)
            {
                return BadRequest("Something went wrong while filtering buses. " + ex.Message);
            }
        }

        // GET: api/Buses/5
        [HttpGet("get-bus/{id}")]
        public async Task<ActionResult<BusTrips>> GetBus(int id)
        {
            var bus = await _context.BusTrips.FindAsync(id);

            if (bus == null)
            {
                return NotFound();
            }

            return bus;
        }

        [HttpPost("add-bustrip")]
        public async Task<ActionResult<BusTrips>> AddBus(BusTrips bus)
        {
            // Check if a bus with the same BusTripsId already exists
            if (BusExists(bus.BusTripsId))
            {
                return Conflict("A bus trip with the same Id already exists.");
            }
            var existingBus = await _context.Buses.FindAsync(bus.BusId);
            if (existingBus == null)
            {
                return NotFound("Bus not found.");
            }


            BusTrips _bus = new BusTrips()
            {
                Origin = bus.Origin,
                Destination = bus.Destination,
                TicketsAvailable = bus.TicketsAvailable,
                DepartureTime = bus.DepartureTime,
                ArrivalTime = bus.DepartureTime,
                TicketPrice = bus.TicketPrice,
                BusId = bus.BusId,
                Bus = existingBus
            };

            if (existingBus.BusTrips == null)
            {
                existingBus.BusTrips = new List<BusTrips>();
            }

            existingBus.BusTrips.Add(_bus);

            _context.BusTrips.Add(_bus);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBus), new { id = _bus.BusTripsId }, _bus);
        }


        // PUT: api/Buses/Edit/5
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditBus(int id, BusTrips bus)
        {
            if (id != bus.BusTripsId)
            {
                return BadRequest();
            }

            _context.Entry(bus).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BusExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Buses/5
        [HttpDelete("delete-bustrip/{id}")]
        public async Task<IActionResult> DeleteBus(int id)
        {
            var bus = await _context.BusTrips.FindAsync(id);
            if (bus == null)
            {
                return NotFound();
            }

            _context.BusTrips.Remove(bus);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BusExists(int id)
        {
            return _context.BusTrips.Any(e => e.BusTripsId == id);
        }
    }
}