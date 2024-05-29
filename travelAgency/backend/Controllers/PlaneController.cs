using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecureWebSite.Server.Data;
using SecureWebSite.Server.Models;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;

namespace SecureWebSite.Server.Controllers
{
    [Route("api/plane")]
    [ApiController]
    public class PlaneController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PlaneController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("create_plane")]
        public async Task<ActionResult> CreatePlane(Plane plane)
        {
            try
            {

                var flightCompany = await _context.FlightCompanies.FindAsync(plane.FlightCompanyId);

                if (flightCompany == null)
                {
                    return NotFound($"FlightCompany with ID {plane.FlightCompanyId} not found.");
                }
                var existingPlane = await _context.Planes.FirstOrDefaultAsync(p => p.FlightCompanyId == plane.FlightCompanyId && p.PlaneNumber == plane.PlaneNumber);
                
                if (existingPlane != null)
                {
                    return BadRequest($"A plane with the same Plane Number '{plane.PlaneNumber}' already exists for this flight company.");
                }

                Plane _plane = new Plane()
                {
                    PlaneNumber = plane.PlaneNumber,
                    FlightCompanyId = plane.FlightCompanyId,
                    FlightCompany = flightCompany,
                };

                if (flightCompany.Planes == null)
                {
                    // If flightCompany.Planes is null, initialize it with a new empty list
                    flightCompany.Planes = new List<Plane>();
                }

                // Add the new plane to the list of planes associated with the flight company
                flightCompany.Planes.Add(_plane);

                _context.Planes.Add(_plane);

                await _context.SaveChangesAsync();

                var options = new JsonSerializerOptions
                {
                    ReferenceHandler = ReferenceHandler.Preserve
                };

                // Serialize the flightCompany object with configured options
                var json = JsonSerializer.Serialize(_plane, options);

                return Ok(json); // Return JSON response
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occured: {ex.Message}");
            }
        }

        [HttpGet("get_companies")]
        public async Task<ActionResult<IEnumerable<FlightCompany>>> GetFlightCompanies()
        {
            try
            {
                // Retrieve all flight companies from the database
                var flightCompanies = await _context.FlightCompanies.Select(f => new { FlightCompanyId = f.FlightCompanyId, FlightCompany = f.CompanyName, Planes = f.Planes }).ToListAsync();
                return Ok(flightCompanies);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong while fetching flight companies. " + ex.Message });
            }
        }

        [HttpPut("edit_plane_{id}")]
        public async Task<IActionResult> Update(int id, Plane plane)
        {
            if (id != plane.PlaneId)
            {
                return BadRequest(new { message = "Plane Ids do not match" }); // Request ID doesn't match plane ID
            }

            var _plane = await _context.Planes.FindAsync(id);
            if (_plane == null)
            {
                return NotFound( new {message = "Plane Not Found!"}); // Plane not found
            }

            _plane.PlaneNumber = plane.PlaneNumber;

            await _context.SaveChangesAsync();

            return Ok( new { message = "Plane updated successfully!", _plane }); // Plane updated successfully
        }

        [HttpDelete("delete_plane_{id}")]
        public async Task<IActionResult> DeletePlane(int id)
        {
            var plane = _context.Planes.FirstOrDefault(p => p.PlaneId == id); ;
            if (plane == null)
            {
                return NotFound(); // Plane not found
            }

            _context.Planes.Remove(plane);
            await _context.SaveChangesAsync();

            return Ok(new {message = "Plane deleted successfully!" });
        }


    [HttpPost("create_company")]
        public async Task<ActionResult> CreateCompany(FlightCompany company)
        {
            try
            {
                var existingCompany = await _context.FlightCompanies.FirstOrDefaultAsync(c => c.CompanyName == company.CompanyName);

                if (existingCompany != null)
                {
                    // Company with the same name already exists
                    return BadRequest($"A company with the name '{company.CompanyName}' already exists.");
                }

                _context.FlightCompanies.Add(company);
                await _context.SaveChangesAsync();
                return (Ok(new { message = "Added company successfuly.", company }));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
