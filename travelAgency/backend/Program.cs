using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SecureWebSite.Server.Data;
using SecureWebSite.Server.Models;
using System.Text;

namespace SecureWebSite.Server
{
		public class Program
		{
				public static void Main(string[] args)
				{
						var builder = WebApplication.CreateBuilder(args);

						// Add services to the container.

						builder.Services.AddControllers();
						builder.Services.AddAuthorization();
						builder.Services.AddDbContext<ApplicationDbContext>(options =>{
								options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
						});

						builder.Services.AddIdentityApiEndpoints<User>().AddEntityFrameworkStores<ApplicationDbContext>();

						builder.Services.AddIdentityCore<User>(options => {
								options.SignIn.RequireConfirmedAccount = true;
								options.Password.RequiredLength = 6;
								options.Password.RequiredUniqueChars = 0;
								options.Password.RequireLowercase = false;
								options.Password.RequireUppercase = false;

								options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
								options.Lockout.AllowedForNewUsers = true;
							

								// User settings
								options.User.RequireUniqueEmail = true;

						}).AddEntityFrameworkStores<ApplicationDbContext>();


						builder.Services.AddAuthentication(options =>
						{
							options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
							options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
						}).AddJwtBearer(options =>
						{
							options.TokenValidationParameters = new TokenValidationParameters()
							{
								ValidateActor = true,
								ValidateIssuer = true,
								ValidateAudience = true,
								RequireExpirationTime = true,
								ValidateIssuerSigningKey = true,
								ValidIssuer = builder.Configuration.GetSection("Jwt:Issuer").Value,
								ValidAudience = builder.Configuration.GetSection("Jwt:Audience").Value,
								IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Jwt:Key").Value))
                        };
						});
						var app = builder.Build();

						app.UseDefaultFiles();
						app.UseStaticFiles();

						// Configure the HTTP request pipeline.

						app.UseHttpsRedirection();

						app.UseAuthentication();
						app.UseAuthorization();
						app.MapIdentityApi<User>();

						app.MapControllers();

						app.MapFallbackToFile("/index.html");

						app.Run();
				}
		}
}
