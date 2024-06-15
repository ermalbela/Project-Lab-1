using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureWebSite.Server.Data;
using SecureWebSite.Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Threading.Tasks;
using YourNamespace.Models;

namespace SecureWebSite.Server.Controllers
{
    [Route("api/buscompany")]
    [ApiController]
    public class BusCompanyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BusCompanyController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/BusCompany
        [HttpGet("get-bus-companies")]
        public async Task<ActionResult<IEnumerable<BusCompany>>> GetBusCompanies()
        {
            try
            {
                
                var busCompanies = await _context.BusCompanies.Select(f => new { f.BusCompanyId, BusCompany = f.Name, f.Buses }).ToListAsync();
                return Ok(busCompanies);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong while getting Bus Companies. " + ex.Message });
            }
        }

        // GET: api/BusCompany/5
        [HttpGet("get-buscompany/{id}")]
        public async Task<ActionResult<BusCompany>> GetBusCompany(int id)
        {
            var busCompany = await _context.BusCompanies.FindAsync(id);

            if (busCompany == null)
            {
                return NotFound();
            }

            return busCompany;
        }

        // PUT: api/BusCompany/5
        [HttpPut("edit-bus-company/{id}")]
        public async Task<IActionResult> PutBusCompany(int id, BusCompany busCompany)
        {
            if (id != busCompany.BusCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(busCompany).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BusCompanyExists(id,busCompany.Name))
                {
                    return NotFound();
                }
            }

            return Ok(new { message = "Company edited successfully.", busCompany });
        }

        // POST: api/BusCompany
        [HttpPost("add-bus-company")]
        public async Task<ActionResult<BusCompany>> PostBusCompany(BusCompany busCompany)
        {
            if (BusCompanyExists(busCompany.BusCompanyId, busCompany.Name)) {
                return BadRequest("Bus Company Already Exists!");
            }
            _context.BusCompanies.Add(busCompany);
            await _context.SaveChangesAsync();

            return Ok(busCompany);
        }

        // DELETE: api/BusCompany/5
        [HttpDelete("delete-bus-company/{id}")]
        public async Task<IActionResult> DeleteBusCompany(int id)
        {
            var busCompany = await _context.BusCompanies.FindAsync(id);
            if (busCompany == null)
            {
                return NotFound();
            }

            _context.BusCompanies.Remove(busCompany);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BusCompanyExists(int id, string name)
        {
            return _context.BusCompanies.Any(e => e.BusCompanyId == id || e.Name == name);
     
        }
         [HttpGet("get-buses")]
        public async Task<ActionResult<IEnumerable<Bus>>> GetBuses()
        {
            return await _context.Buses.ToListAsync();
        }

        // GET: api/Bus/5
        [HttpGet("get-bus/{id}")]
        public async Task<ActionResult<Bus>> GetBus(int id)
        {
            var bus = await _context.Buses.FindAsync(id);

            if (bus == null)
            {
                return NotFound();
            }

            return bus;
        }

        // PUT: api/Bus/5
        [HttpPut("edit-bus/{id}")]
        public async Task<IActionResult> PutBus(int id, Bus bus)
        {
            {
                if (id != bus.BusId)
                {
                    return BadRequest(new { message = "Bus Ids do not match" }); // Request ID doesn't match plane ID
                }

                var _bus = await _context.Buses.FindAsync(id);
                if (_bus == null)
                {
                    return NotFound(new { message = "Bus Not Found!" }); // Plane not found
                }

                var existingBusWithSameNumber = await _context.Buses
                    .Where(b => b.BusId != id && b.BusCompanyId == _bus.BusCompanyId && b.BusNumber == bus.BusNumber)
                    .FirstOrDefaultAsync();

                if (existingBusWithSameNumber != null)
                {
                    return BadRequest(new { message = "A bus with the same Bus Number already exists in the same bus company." });
                }

                _bus.BusNumber = bus.BusNumber;
                _bus.DeckersNr = bus.DeckersNr;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Bus updated successfully!", _bus }); // Plane updated successfully
            }
        }

        // POST: api/Bus
        [HttpPost("add-bus")]
        public async Task<ActionResult<Bus>> PostBus(Bus bus)
        {
            try
            {

                var busCompany = await _context.BusCompanies.FindAsync(bus.BusCompanyId);

                if (busCompany == null)
                {
                    return NotFound($"BusCompany with ID {bus.BusCompanyId} not found.");
                }
                var existingBus = await _context.Buses.FirstOrDefaultAsync(p => p.BusCompanyId == bus.BusCompanyId && p.BusNumber == bus.BusNumber);

                if (existingBus != null)
                {
                    return BadRequest($"A bus with the same bus Number '{bus.BusNumber}' already exists for this flight company.");
                }

                Bus _bus = new Bus()
                {
                    BusNumber = bus.BusNumber,
                    BusCompanyId = bus.BusCompanyId,
                    DeckersNr = bus.DeckersNr,
                    BusCompany = busCompany,
                };

                if (busCompany.Buses == null)
                {
                    
                    busCompany.Buses = new List<Bus>();
                }

            
               busCompany.Buses.Add(_bus);

                _context.Buses.Add(_bus);

                await _context.SaveChangesAsync();

                var options = new JsonSerializerOptions
                {
                    ReferenceHandler = ReferenceHandler.Preserve
                };

                
                var json = JsonSerializer.Serialize(_bus, options);

                return Ok(json); // Return JSON response
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occured: {ex.Message}");
            }
        }

        // DELETE: api/Bus/5
        [HttpDelete("delete-bus/{id}")]
        public async Task<IActionResult> DeleteBus(int id)
        {
            var bus = await _context.Buses.FindAsync(id);
            if (bus == null)
            {
                return NotFound();
            }

            _context.Buses.Remove(bus);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool BusExists(int id)
        {
            return _context.Buses.Any(e => e.BusId == id);
        }
    }
}
