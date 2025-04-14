

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DataStore.Abstraction.Models;
using DataStore.Abstraction.Repositories;
using FeatureObjects.Abstraction.Managers;
using FeatureObjects.Abstraction.ViewModels;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace FeatureObjects.Implementation.Managers
{
    public class UserManager : IUserManager
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public UserManager(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<UserDTO?> GetUserByEmail(string email)
        {
            var user = await _userRepository.GetUserByEmail(email);
            if (user == null) return null;

            return new UserDTO
            {
                UserId = user.UserId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                ProfileImage = user.ProfileImage ?? "/images/profile-default.jpg",
                Role = user.Role
            };
        }


        public async Task<bool> Register(Register model)
        {
            string? profileImagePath = "/images/profile-default.jpg";


            if (model.ProfileImage != null && model.ProfileImage.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                Directory.CreateDirectory(uploadsFolder);

                var fileName = $"{Guid.NewGuid()}_{model.ProfileImage.FileName}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.ProfileImage.CopyToAsync(stream);
                }

                profileImagePath = $"/uploads/{fileName}";
            }
            Console.WriteLine($"Final Profile Image Path: {profileImagePath ?? "NULL"}");
            var user = new User
            {
                UserId = Guid.NewGuid(),
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                ProfileImage = profileImagePath ?? "/images/profile-default.jpg"
            };

            return await _userRepository.Register(user);
        }

        public async Task<AuthResponse?> Authenticate(Login model)
        {
            var user = await _userRepository.GetUserByEmail(model.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
            {
                return null;
            }
            var token = GenerateJwtToken(user);
            return new AuthResponse { Token = token, Role = user.Role };
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


        public async Task<bool> RequestPasswordReset(string email)
        {
            var user = await _userRepository.GetUserByEmail(email);
            if (user == null)
            {
                Console.WriteLine("Error: Email not found in the database.");
                return false;
            }

            var resetToken = Guid.NewGuid().ToString();
            bool tokenSaved = await _userRepository.SavePasswordResetToken(user.UserId, resetToken);
            if (!tokenSaved)
            {
                Console.WriteLine("Error: Failed to save reset token.");
                return false;
            }

            var resetLink = $"{_configuration["AppSettings:FrontendUrl"]}/reset-password?token={resetToken}";

            bool emailSent = SendResetEmail(user.Email, resetLink);
            if (!emailSent)
            {
                Console.WriteLine("Error: Failed to send reset email.");
                return false;
            }

            return true;
        }


        public async Task<bool> ResetPassword(ResetPassword model)
        {
            var userId = await _userRepository.GetUserIdByResetToken(model.Token);
            if (userId == null) return false;

            var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            await _userRepository.UpdatePassword(userId.Value, newPasswordHash);
            return true;
        }

        private bool SendResetEmail(string email, string resetLink)
        {
            try
            {
                var smtpClient = new SmtpClient(_configuration["Email:SmtpServer"])
                {
                    Port = int.Parse(_configuration["Email:Port"]),
                    Credentials = new NetworkCredential(_configuration["Email:Username"], _configuration["Email:Password"]),
                    EnableSsl = true,
                };

                using var mailMessage = new MailMessage
                {
                    From = new MailAddress(_configuration["Email:Username"]),
                    Subject = "Password Reset Request",
                    Body = $"<p>Click the link below to reset your password:</p><p><a href='{resetLink}'>{resetLink}</a></p>",
                    IsBodyHtml = true,
                };
                mailMessage.To.Add(email);
                smtpClient.Send(mailMessage);
                Console.WriteLine($"Password reset email sent to: {email}");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
                return false;
            }
        }
    }
}
