using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataStore.Abstraction.Models;
using DataStore.Abstraction.Repositories;
using FeatureObjects.Abstraction.Managers;
using FeatureObjects.Abstraction.ViewModels;
using Microsoft.AspNetCore.Http;

namespace FeatureObjects.Implementation.Managers
{
    public class StartupManager : IStartupManager
    {
        private readonly IStartupRepository _startupRepository;

        public StartupManager(IStartupRepository startupRepository)
        {
            _startupRepository = startupRepository;
        }

        public async Task<Guid> RegisterStartupAsync(StartupRegistrationRequest request, Guid userId)
        {
            var startup = new Startup
            {
                StartupId = Guid.NewGuid(),
                UserId = userId,
                Name = request.Name,
                Description = request.Description,
                IndustryType = request.IndustryType,
                TotalFundingGoal = request.TotalFundingGoal,
                EquityOffered = request.EquityOffered,
                MinInvestment = request.MinInvestment,
                MaxInvestment = request.MaxInvestment,
                FundingDeadline = request.FundingDeadline,
                RefundPolicy = request.RefundPolicy,
                InvestorPerks = request.InvestorPerks,
                PricePerShare = request.PricePerShare,
                PitchDeckPath = await SaveFileAsync(request.PitchDeck),
                LogoPath = await SaveFileAsync(request.Logo),
                BannerPath = await SaveFileAsync(request.Banner),
                BusinessDocPath = await SaveFileAsync(request.BusinessDoc),
                TermsDocPath = await SaveFileAsync(request.TermsDoc)
            };
            Console.WriteLine($"PitchDeckPath: {startup.PitchDeckPath}");
            Console.WriteLine($"LogoPath: {startup.LogoPath}");
            Console.WriteLine($"BannerPath: {startup.BannerPath}");
            Console.WriteLine($"BusinessDocPath: {startup.BusinessDocPath}");
            Console.WriteLine($"TermsDocPath: {startup.TermsDocPath}");

            return await _startupRepository.RegisterStartupAsync(startup);
        }





        public async Task<IEnumerable<StartupResponseDTO>> GetAllStartupsAsync()
        {
            var startups = await _startupRepository.GetAllStartupsAsync();
            return startups.Select(s => new StartupResponseDTO
            {
                StartupId = s.StartupId,
                UserId = s.UserId,
                Name = s.Name,
                Description = s.Description,
                IndustryType = s.IndustryType,
                TotalFundingGoal = s.TotalFundingGoal,
                EquityOffered = s.EquityOffered,
                PreMoneyValuation = s.PreMoneyValuation,
                PricePerShare = s.PricePerShare,
                MinInvestment = s.MinInvestment,
                MaxInvestment = s.MaxInvestment,
                FundingDeadline = s.FundingDeadline,
                Status = s.Status,
                CreatedAt = s.CreatedAt,
                PitchDeckPath = s.PitchDeckPath,
                LogoPath = s.LogoPath,
                BannerPath = s.BannerPath,
                BusinessDocPath = s.BusinessDocPath,
                TermsDocPath = s.TermsDocPath,
                TotalInvestment = s.TotalInvestment
            });
        }

        public async Task<StartupResponseDTO?> GetStartupByIdAsync(Guid startupId)
        {
            var startup = await _startupRepository.GetStartupByIdAsync(startupId);
            if (startup == null) return null;

            return new StartupResponseDTO
            {
                StartupId = startup.StartupId,
                UserId = startup.UserId,
                Name = startup.Name,
                Description = startup.Description,
                IndustryType = startup.IndustryType,
                TotalFundingGoal = startup.TotalFundingGoal,
                EquityOffered = startup.EquityOffered,
                PreMoneyValuation = startup.PreMoneyValuation,
                PricePerShare = startup.PricePerShare,
                MinInvestment = startup.MinInvestment,
                MaxInvestment = startup.MaxInvestment,
                FundingDeadline = startup.FundingDeadline,
                Status = startup.Status,
                CreatedAt = startup.CreatedAt,
                PitchDeckPath = startup.PitchDeckPath,
                LogoPath = startup.LogoPath,
                BannerPath = startup.BannerPath,
                BusinessDocPath = startup.BusinessDocPath,
                TermsDocPath = startup.TermsDocPath,
                TotalInvestment = startup.TotalInvestment
            };
        }


        public async Task<bool> UpdateStartupStatusAsync(Guid startupId, string status)
        {
            return await _startupRepository.UpdateStartupStatusAsync(startupId, status);
        }



        private async Task<string?> SaveFileAsync(IFormFile? file)
        {
            if (file == null || file.Length == 0) return null;

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            Console.WriteLine($"Saving file: {filePath}");

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/{fileName}";
        }



    }
}
