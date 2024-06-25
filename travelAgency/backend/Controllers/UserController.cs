using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SecureWebSite.Server.Data;
using SecureWebSite.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SecureWebSite.Server.Controllers
{
		[Route("api/users")]
		[ApiController]
		public class UserController(SignInManager<User> sm, UserManager<User> um, IConfiguration config, ApplicationDbContext context) : ControllerBase
		{
				private readonly SignInManager<User> signInManager = sm;
				private readonly UserManager<User> userManager = um;
				private readonly IConfiguration _config = config;
				private readonly ApplicationDbContext _context = context;

        [HttpPost("register")]
				public async Task<ActionResult> RegisterUser(User user)
				{

						IdentityResult result = new ();

						try {
								User user_ = new User()
								{
									Name = user.Name,
									Email = user.Email,
									UserName = user.UserName,
									Role = "Superadmin"
								};

								result = await userManager.CreateAsync(user_, user.PasswordHash);

								if(!result.Succeeded){
										return BadRequest(result);
								}
						} catch(Exception ex) {
								return BadRequest("Something went wrong, please try again. " + ex.Message);
						}

						return Ok(new { message = "Registered Successfully.", result });
				}

				[HttpPost("login")]
				public async Task<ActionResult> LoginUser(Login login)
				{

						try
						{
								User user_ = await userManager.FindByEmailAsync(login.Email);
								if(user_ != null){
										login.Username = user_.UserName;

										if(!user_.EmailConfirmed){
										   user_.EmailConfirmed = true;
										}

										var result = await signInManager.PasswordSignInAsync(user_, login.Password, login.Remember, false);

										if (!result.Succeeded)
										{
												return Unauthorized(new {message = "Check your login credentials and try again" });
										}

										user_.LastLogin = DateTime.Now;
										var updateResult = await userManager.UpdateAsync(user_);

										var claims = new List<Claim>
										{
											new Claim(ClaimTypes.Email,user_.UserName),
											new Claim(ClaimTypes.Role,user_.Role == "Superadmin" ? "Superadmin" : user_.Role == "Admin" ? "Admin" : "User")
										};
										var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("Jwt:Key").Value));

										var signInCred = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

										var securityToken = new JwtSecurityToken(
											claims: claims,
											expires: DateTime.Now.AddMinutes(60),
											issuer: _config.GetSection("Jwt:Issuer").Value,
											audience: _config.GetSection("Jwt:Audience").Value,
											signingCredentials: signInCred
										);
										var tokenString = new JwtSecurityTokenHandler().WriteToken(securityToken);

										HttpContext.Response.Cookies.Append("token", tokenString, new CookieOptions
										{
											HttpOnly = true,
											Secure = true,
											SameSite = SameSiteMode.Strict,
											Expires = DateTime.Now.AddMinutes(60)
										});
										
										return Ok(new {updateResult = user_, tokenString});
								} else {
										return BadRequest(new {message = "Please check your credentials and try again. " });
								}
						}
						catch (Exception ex)
						{
								return BadRequest(new {message = "Something went wrong, please try again. " + ex.Message });
						}

				}

				[HttpGet("logout")]
				public async Task<ActionResult> LogoutUser(){
						
						try {
								await signInManager.SignOutAsync();
						} catch (Exception ex) {
								return BadRequest(new {message = "Someting went wrong, please try again. " + ex.Message });
						}

						return Ok(new { message = "You are free to go!" });
				}

				[HttpGet("users")]
				public async Task<ActionResult<IEnumerable<User>>> GetUsers()
				{
					try
					{
					// Retrieve all users from the database
						var users = await userManager.Users.Select(u => new { userName = u.UserName, email = u.Email}).ToListAsync();
						return Ok(users);
					}
					catch (Exception ex)
					{
						return BadRequest(new { message = "Something went wrong while fetching users. " + ex.Message });
					}
				}

				[HttpGet("get-user_{id}")]
				public async Task<ActionResult<User>> GetUserById(string id)
				{
					try
					{
						// Retrieve the user from the database by ID
						var user = await _context.Users.Where(u => u.Id == id).Select(u => new { u.FlightTicket, u.BusTicket, u.UserName, u.FlightTicket.Flight, u.BusTicket.BusTrips }).FirstOrDefaultAsync();
						if (user == null)
						{
							return NotFound(new { message = "User not found." });
						}

						return Ok(user);
					}
					catch (Exception ex)
					{
						return BadRequest(new { message = "Something went wrong while fetching the user. " + ex.Message });
					}
				}

				[HttpDelete("cancel_flight_{userId}")]
				public async Task<ActionResult> CancelFlight(string userId)
				{
					try
					{
						var existingUser = await userManager.FindByIdAsync(userId);
						if (existingUser == null)
						{
							return NotFound("User not found.");
						}

						// Check if user has a flight ticket
						if (existingUser.FlightTicketId == null)
						{
							return BadRequest("User does not have a flight ticket to cancel.");
						}

						// Find the associated FlightTicket
						var flightTicket = await _context.FlightTickets.FindAsync(existingUser.FlightTicketId);
						if (flightTicket == null)
						{
							return NotFound("Flight ticket not found.");
						}

						// Remove the user from the FlightTicket
						flightTicket.Users.Remove(existingUser);

						// If no more users associated with the FlightTicket, delete it
						if (flightTicket.Users.Count == 0)
						{
							_context.FlightTickets.Remove(flightTicket);
						}

						// Reset user's FlightTicketId and FlightTicket reference
						existingUser.FlightTicketId = null;
						existingUser.FlightTicket = null;

						// Save changes to the database
						await _context.SaveChangesAsync();

						// Update the user record
						await userManager.UpdateAsync(existingUser);

						return Ok(new { message = "Flight ticket cancelled successfully." });
					}
					catch (Exception ex)
					{
						return StatusCode(500, $"An error occurred: {ex.Message}");
					}
				}

				[HttpDelete("cancel_bus_trip_{userId}")]
				public async Task<ActionResult> CancelBusTrip(string userId)
				{
					try
					{
						var existingUser = await userManager.FindByIdAsync(userId);
						if (existingUser == null)
						{
							return NotFound("User not found.");
						}

						if (existingUser.BusTicketId == null)
						{
							return BadRequest("User does not have a bus trip ticket to cancel.");
						}

						var busTicket = await _context.BusTickets.FindAsync(existingUser.BusTicketId);
						if (busTicket == null)
						{
							return NotFound("Bus ticket not found.");
						}

						busTicket.Users.Remove(existingUser);

						if (busTicket.Users.Count == 0)
						{
							_context.BusTickets.Remove(busTicket);
						}

						existingUser.BusTicketId = null;
						existingUser.BusTicket = null;

						// Save changes to the database
						await _context.SaveChangesAsync();

						// Update the user record
						await userManager.UpdateAsync(existingUser);

						return Ok(new { message = "Bus trip ticket cancelled successfully." });
					}
					catch (Exception ex)
					{
						return StatusCode(500, $"An error occurred: {ex.Message}");
					}
				}

				[HttpPost("trips_cleanup")]
				public async Task<ActionResult> RemoveExpiredTrips()
				{

					try
					{
						var now = DateTime.UtcNow; // Use UTC to avoid timezone issues
						var nowDate = now.Date; // Get current date
						var nowTime = TimeOnly.FromDateTime(now); // Get current time
						var nowTimeSpan = now.TimeOfDay; // Get current time


						var expiredFlights = await _context.Flights
							.Where(f => f.Reservation.Date < nowDate || (f.Reservation.Date == nowDate && f.Arrival <= nowTime))
							.ToListAsync();

						if (expiredFlights.Any())
						{

							foreach (var flight in expiredFlights)
							{
								var relatedFlightTickets = await _context.FlightTickets
									.Where(ft => ft.Flight.FlightId == flight.FlightId)
									.ToListAsync();

								foreach (var flightTicket in relatedFlightTickets)
								{
									var relatedUsers = await _context.Users
										.Where(u => u.FlightTicketId == flightTicket.FlightTicketId)
										.ToListAsync();

									foreach (var user in relatedUsers)
									{
										user.FlightTicketId = null;
									}

									_context.Users.UpdateRange(relatedUsers);
									await _context.SaveChangesAsync();  // Save changes after updating users

									_context.FlightTickets.Remove(flightTicket);
								}

								await _context.SaveChangesAsync();  // Save changes after removing flight tickets

								_context.Flights.Remove(flight);
							}
						}
						var expiredBusTrips = await _context.BusTrips
						.Where(b => b.Reservation.Date < nowDate || (b.Reservation.Date == nowDate && b.ArrivalTime <= nowTimeSpan))
						.ToListAsync();

						if (expiredBusTrips.Any())
						{

							foreach (var busTrip in expiredBusTrips)
							{
								var relatedBusTickets = await _context.BusTickets
									.Where(ft => ft.BusTrips.BusTripsId == busTrip.BusTripsId)
									.ToListAsync();

								foreach (var busTicket in relatedBusTickets)
								{
									var relatedUsers = await _context.Users
										.Where(u => u.BusTicketId == busTicket.BusTicketId)
										.ToListAsync();

									foreach (var user in relatedUsers)
									{
										user.BusTicketId = null;
									}

									_context.Users.UpdateRange(relatedUsers);
									await _context.SaveChangesAsync();

									_context.BusTickets.Remove(busTicket);
								}

								await _context.SaveChangesAsync();

								_context.BusTrips.Remove(busTrip);
							}

							await _context.SaveChangesAsync();
						}
						return Ok(new { expiredFlights, expiredBusTrips });
					}
					catch (Exception ex)
					{
						return BadRequest(new { message = ex.Message });
					}
				}

        [HttpGet("user-role")]
				public ActionResult GetUserRole()
				{
					var token = Request.Cookies["token"];
					if (string.IsNullOrEmpty(token))
					{
						return Unauthorized();
					}

					var tokenHandler = new JwtSecurityTokenHandler();
					var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));

					try
					{
						var claimsPrincipal = tokenHandler.ValidateToken(token, new TokenValidationParameters
						{
							ValidateIssuer = true,
							ValidateAudience = true,
							ValidIssuer = _config["Jwt:Issuer"],
							ValidAudience = _config["Jwt:Audience"],
							IssuerSigningKey = securityKey
						}, out var validatedToken);

						var roleClaim = claimsPrincipal.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Role);
						if (roleClaim == null)
						{
							return Unauthorized();
						}

						return Ok(new { role = roleClaim.Value });
					}
					catch (Exception)
					{
						return Unauthorized();
					}
				}

    }
}
