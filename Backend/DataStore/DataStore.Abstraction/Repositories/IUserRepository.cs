using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataStore.Abstraction.Models;

namespace DataStore.Abstraction.Repositories
{
    public interface IUserRepository
    {
        Task<bool> Register(User user);
        Task<User?> GetUserByEmail(string email);
        Task<bool> SavePasswordResetToken(Guid userId, string token);
        Task<Guid?> GetUserIdByResetToken(string token);
        Task<bool> UpdatePassword(Guid userId, string newPasswordHash);
    }
}
