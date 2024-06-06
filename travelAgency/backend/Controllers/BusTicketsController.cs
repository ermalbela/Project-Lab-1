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
    public class BusTicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BusTicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/BusTickets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BusTicket>>> GetBusTickets()
        {
            return await _context.BusTickets.ToListAsync();
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

        // POST: api/BusTickets/Add
        [HttpPost("Add")]
        public async Task<ActionResult<BusTicket>> AddBusTicket(BusTicket busTicket)
        {
            _context.BusTickets.Add(busTicket);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBusTicket), new { id = busTicket.BusTicketId }, busTicket);
        }

        // PUT: api/BusTickets/Edit/5
        [HttpPut("Edit/{id}")]
        public async Task<IActionResult> EditBusTicket(int id, BusTicket busTicket)
        {
            if (id != busTicket.BusTicketId)
            {
                return BadRequest();
            }

            _context.Entry(busTicket).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BusTicketExists(id))
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

        // DELETE: api/BusTickets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBusTicket(int id)
        {
            var busTicket = await _context.BusTickets.FindAsync(id);
            if (busTicket == null)
            {
                return NotFound();
            }

            _context.BusTickets.Remove(busTicket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BusTicketExists(int id)
        {
            return _context.BusTickets.Any(e => e.BusTicketId == id);
        }
    }
}
