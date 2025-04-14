using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FeatureObjects.Abstraction.ViewModels;

namespace FeatureObjects.Abstraction.Managers
{
    public interface IStartupManager
    {
        Task<Guid> RegisterStartupAsync(StartupRegistrationRequest request, Guid userId);
        Task<IEnumerable<StartupResponseDTO>> GetAllStartupsAsync();
        Task<StartupResponseDTO?> GetStartupByIdAsync(Guid startupId);
        Task<bool> UpdateStartupStatusAsync(Guid startupId, string status);

    }
}
