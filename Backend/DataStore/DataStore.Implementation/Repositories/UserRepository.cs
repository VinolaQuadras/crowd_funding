using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using DataStore.Abstraction.Models;
using DataStore.Abstraction.Repositories;

namespace DataStore.Implementation.Repositories
{
    public class UserRepository : IUserRepository
    {

        private readonly DapperContext _context;


        public UserRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<bool> Register(User user)
        {
            if (user.Email == "admin@gmail.com")
            {
                user.Role = "Admin";
            }
            else
            {
                user.Role = "User";
            }
            string query = "INSERT INTO Users (UserId, FirstName, LastName, Email, PasswordHash, PhoneNumber, ProfileImage,Role) VALUES (@UserId, @FirstName, @LastName, @Email, @PasswordHash, @PhoneNumber, @ProfileImage,@Role)";

            using var connection = _context.CreateConnection();
            var result = await connection.ExecuteAsync(query, user);
            return result > 0;
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            string query = "SELECT * FROM Users WHERE Email = @Email";

            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(query, new { Email = email });
        }

        public async Task<bool> SavePasswordResetToken(Guid userId, string token)
        {
            string query = "INSERT INTO PasswordResets (UserId, ResetToken, Expiry) VALUES (@UserId, @ResetToken, DATEADD(HOUR, 1, GETUTCDATE()))";
            using var connection = _context.CreateConnection();
            return await connection.ExecuteAsync(query, new { UserId = userId, ResetToken = token }) > 0;
        }

        public async Task<Guid?> GetUserIdByResetToken(string token)
        {
            string query = "SELECT UserId FROM PasswordResets WHERE ResetToken = @ResetToken AND Expiry > GETUTCDATE()";
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Guid?>(query, new { ResetToken = token });
        }

        public async Task<bool> UpdatePassword(Guid userId, string newPasswordHash)
        {
            string query = "UPDATE Users SET PasswordHash = @PasswordHash WHERE UserId = @UserId";
            using var connection = _context.CreateConnection();
            return await connection.ExecuteAsync(query, new { UserId = userId, PasswordHash = newPasswordHash }) > 0;
        }

    }
}
