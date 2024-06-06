using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureWebSite.Server.Data;
using SecureWebSite.Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SecureWebSite.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BusesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Buses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BusTrips>>> GetBuses()
        {
            return await _context.BusTrips.ToListAsync();
        }

        // GET: api/Buses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BusTrips>> GetBus(int id)
        {
            var bus = await _context.BusTrips.FindAsync(id);

            if (bus == null)
            {
                return NotFound();
            }

            return bus;
        }

        // POST: api/Buses/Add
        [HttpPost("Add")]
        public async Task<ActionResult<BusTrips>> AddBus(BusTrips bus)
        {
            // Check if a bus with the same BusTripsId already exists
            if (BusExists(bus.BusTripsId))
            {
                return Conflict("A bus trip with the same Id already exists.");
            }

            _context.BusTrips.Add(bus);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBus), new { id = bus.BusTripsId }, bus);
        }

        // PUT: api/Buses/Edit/5
        [HttpPut("Edit/{id}")]
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
        [HttpDelete("{id}")]
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