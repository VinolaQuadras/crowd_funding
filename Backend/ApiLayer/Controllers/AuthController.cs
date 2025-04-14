

using System.Security.Claims;
using FeatureObjects.Abstraction.Managers;
using FeatureObjects.Abstraction.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Win32;

namespace ApiLayer.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserManager _userManager;

        public AuthController(IUserManager userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] Register model)
        {
            Console.WriteLine($"ProfileImage: {model.ProfileImage?.FileName}");

            if (model.ProfileImage != null)
            {
                Console.WriteLine($"File Name: {model.ProfileImage.FileName}");
                Console.WriteLine($"File Length: {model.ProfileImage.Length}");
            }
            else
            {
                Console.WriteLine("Profile image is NULL");
            }
            var result = await _userManager.Register(model);
            if (!result)
                return BadRequest("Registration failed");

            return Ok("User registered successfully");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            var authResponse = await _userManager.Authenticate(model);
            if (authResponse == null)
                return Unauthorized("Invalid credentials");
            return Ok(authResponse);
        }



        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized("Invalid email.");
            }

            var userDto = await _userManager.GetUserByEmail(email);
            if (userDto == null) return NotFound("User not found");

            return Ok(userDto);
        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPassword model)
        {
            var result = await _userManager.RequestPasswordReset(model.Email);
            if (!result)
                return BadRequest("Email not found or error sending email.");

            return Ok("Password reset email sent.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPassword model)
        {
            var result = await _userManager.ResetPassword(model);
            if (!result)
                return BadRequest("Invalid or expired token.");

            return Ok("Password reset successful.");
        }


    }
}