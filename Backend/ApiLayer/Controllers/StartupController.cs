using System.Security.Claims;
using DataStore.Abstraction.Models;
using FeatureObjects.Abstraction.Managers;
using FeatureObjects.Abstraction.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiLayer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StartupController : ControllerBase
    {
        private readonly IStartupManager _startupManager;

        public StartupController(IStartupManager startupManager)
        {
            _startupManager = startupManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterStartup([FromForm] StartupRegistrationRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine($"UserId being inserted: '{userId}'");

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { Message = "User is not authenticated" });

            if (!Guid.TryParse(userId, out Guid parsedUserId))
                return BadRequest(new { Message = "Invalid UserId format" });


            Console.WriteLine($"PitchDeck Received: {request.PitchDeck?.FileName ?? "NULL"}");
            Console.WriteLine($"Logo Received: {request.Logo?.FileName ?? "NULL"}");
            Console.WriteLine($"Banner Received: {request.Banner?.FileName ?? "NULL"}");
            Console.WriteLine($"BusinessDoc Received: {request.BusinessDoc?.FileName ?? "NULL"}");
            Console.WriteLine($"TermsDoc Received: {request.TermsDoc?.FileName ?? "NULL"}");
            Console.WriteLine($"PricePerShare: {request.PricePerShare}");


            var startupId = await _startupManager.RegisterStartupAsync(request, parsedUserId);

            return Ok(new { Message = "Startup registered successfully", StartupId = startupId });
        }



        [HttpGet]
        public async Task<ActionResult<IEnumerable<StartupResponse>>> GetAllStartups()
        {
            return Ok(await _startupManager.GetAllStartupsAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStartupById(Guid id)
        {
            var startup = await _startupManager.GetStartupByIdAsync(id);
            if (startup == null) return NotFound();
            return Ok(startup);
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStartupStatus(Guid id, [FromBody] UpdateStatusRequest request)
        {

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            Console.WriteLine($"User Role: {userRole}");


            if (userRole != "Admin")
            {
                return Forbid(); // Returns HTTP 403 Forbidden
            }

            Console.WriteLine($"Received Request - ID: {id}, Status: {request.Status}");

            if (string.IsNullOrEmpty(request.Status))
            {
                return BadRequest(new { Message = "Status field is required." });
            }

            if (!new[] { "Pending", "Approved", "Rejected" }.Contains(request.Status))
            {
                return BadRequest(new { Message = "Invalid status value. Allowed values: Pending, Approved, Rejected." });
            }

            var success = await _startupManager.UpdateStartupStatusAsync(id, request.Status);

            if (!success)
            {
                return NotFound(new { Message = "Startup not found" });
            }

            return Ok(new { Message = "Startup status updated successfully" });
        }

    }
}
