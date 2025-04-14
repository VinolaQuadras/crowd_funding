

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
    public class StartupRepository : IStartupRepository
    {
        private readonly DapperContext _context;
        public StartupRepository(DapperContext context) => _context = context;

        public async Task<Guid> RegisterStartupAsync(Startup startup)
        {
            var query = @"INSERT INTO Startups (StartupId, UserId, Name, Description, IndustryType, 
                    PitchDeckPath, LogoPath, BannerPath, TotalFundingGoal, EquityOffered,
                    PricePerShare, MinInvestment, MaxInvestment, FundingDeadline, RefundPolicy, InvestorPerks, 
                    BusinessDocPath, TermsDocPath, Status, CreatedAt)
                    VALUES (@StartupId, @UserId, @Name, @Description, @IndustryType, @PitchDeckPath, @LogoPath, 
                    @BannerPath, @TotalFundingGoal, @EquityOffered, @PricePerShare, @MinInvestment, 
                    @MaxInvestment, @FundingDeadline, @RefundPolicy, @InvestorPerks, @BusinessDocPath, @TermsDocPath, 
                    @Status, @CreatedAt)";
            using var connection = _context.CreateConnection();
            Console.WriteLine($"PricePerShare Inserted: {startup.PricePerShare}");
            await connection.ExecuteAsync(query, startup);
            return startup.StartupId;
        }

        public async Task<IEnumerable<StartupResponse>> GetAllStartupsAsync()
        {
            var query = @"SELECT s.*, 
                        (SELECT ISNULL(SUM(p.Amount), 0) 
                         FROM Payments p 
                         WHERE p.StartupId = s.StartupId AND p.PaymentStatus = 'Success') AS TotalInvestment 
                         FROM Startups s";
            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<StartupResponse>(query);
        }

        public async Task<StartupResponse> GetStartupByIdAsync(Guid startupId)
        {
            var query = @"SELECT s.*, 
                        (SELECT ISNULL(SUM(p.Amount), 0) 
                         FROM Payments p 
                         WHERE p.StartupId = s.StartupId AND p.PaymentStatus = 'Success') AS TotalInvestment 
                         FROM Startups s
                         WHERE s.StartupId = @StartupId";
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<StartupResponse>(query, new { StartupId = startupId });
        }

        public async Task<bool> UpdateStartupStatusAsync(Guid startupId, string status)
        {
            var query = "UPDATE Startups SET Status = @Status WHERE StartupId = @StartupId";
            using var connection = _context.CreateConnection();
            var rowsAffected = await connection.ExecuteAsync(query, new { Status = status, StartupId = startupId });
            return rowsAffected > 0;
        }
    }
}
