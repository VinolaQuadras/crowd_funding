using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FeatureObjects.Abstraction.ViewModels;


namespace FeatureObjects.Abstraction.Managers
{
    public interface IUserManager
    {
        Task<bool> Register(Register model);
        Task<AuthResponse?> Authenticate(Login model);
        Task<bool> RequestPasswordReset(string email);
        Task<bool> ResetPassword(ResetPassword model);
        Task<UserDTO?> GetUserByEmail(string email);
    }
}
