using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataStore.Abstraction.Models;



namespace DataStore.Abstraction.Repositories
{
    public interface IStartupRepository
    {
        Task<Guid> RegisterStartupAsync(Startup startup);
        Task<IEnumerable<StartupResponse>> GetAllStartupsAsync();
        Task<StartupResponse?> GetStartupByIdAsync(Guid startupId);
        Task<bool> UpdateStartupStatusAsync(Guid startupId, string status);
    }
}
