

using System;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using DataStore.Abstraction.Models;
using DataStore.Abstraction.Repositories;

namespace DataStore.Implementation.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly IDbConnection _db;

        public PaymentRepository(DapperContext dbContext)
        {
            _db = dbContext.CreateConnection();
        }

        public async Task<int> CreatePaymentAsync(Payment payment)
        {
            string query = @"INSERT INTO Payments (UserId, StartupId, Amount, PaymentStatus, StripePaymentIntentId, SharesAllocated, CreatedAt, UpdatedAt) 
                         VALUES (@UserId, @StartupId, @Amount, @PaymentStatus, @StripePaymentIntentId, @SharesAllocated, GETDATE(), GETDATE());
                         SELECT CAST(SCOPE_IDENTITY() AS INT);";

            return await _db.ExecuteScalarAsync<int>(query, payment);
        }

        public async Task UpdatePaymentStatusAsync(int paymentId, string status, decimal? sharesAllocated = null)
        {
            string query = @"UPDATE Payments 
                           SET PaymentStatus = @Status, 
                               SharesAllocated = COALESCE(@SharesAllocated, SharesAllocated),
                               UpdatedAt = GETDATE() 
                           WHERE Id = @PaymentId";

            await _db.ExecuteAsync(query, new { PaymentId = paymentId, Status = status, SharesAllocated = sharesAllocated });
        }

        public async Task UpdatePaymentStatusWithSharesAsync(int paymentId, string status, decimal sharesAllocated)
        {
            string query = @"UPDATE Payments 
                           SET PaymentStatus = @Status, 
                               SharesAllocated = @SharesAllocated,
                               UpdatedAt = GETDATE() 
                           WHERE Id = @PaymentId";

            await _db.ExecuteAsync(query, new { PaymentId = paymentId, Status = status, SharesAllocated = sharesAllocated });
        }

        public async Task<Payment> GetPaymentByIntentIdAsync(string intentId)
        {
            string query = "SELECT * FROM Payments WHERE StripePaymentIntentId = @IntentId";
            return await _db.QueryFirstOrDefaultAsync<Payment>(query, new { IntentId = intentId });
        }

        public async Task<Payment> GetPaymentBySessionIdAsync(string sessionId)
        {
            string query = "SELECT * FROM Payments WHERE StripePaymentIntentId = @SessionId";
            return await _db.QueryFirstOrDefaultAsync<Payment>(query, new { SessionId = sessionId });
        }

        public async Task<IEnumerable<PaymentWithStartupInfo>> GetPaymentsByUserIdWithStartupInfoAsync(Guid userId)
        {
            string query = @"
            SELECT p.*, s.Name as StartupName
            FROM Payments p
            JOIN Startups s ON p.StartupId = s.StartupId
            WHERE p.UserId = @UserId
            ORDER BY p.CreatedAt DESC";

            return await _db.QueryAsync<PaymentWithStartupInfo>(query, new { UserId = userId });
        }

        public async Task<PaymentWithStartupInfo> GetPaymentByIdWithStartupInfoAsync(int paymentId)
        {
            string query = @"
            SELECT p.*, s.Name as StartupName
            FROM Payments p
            JOIN Startups s ON p.StartupId = s.StartupId
            WHERE p.Id = @PaymentId";

            return await _db.QueryFirstOrDefaultAsync<PaymentWithStartupInfo>(query, new { PaymentId = paymentId });
        }
        public async Task<IEnumerable<dynamic>> GetPaymentsByStartupIdWithUserInfoAsync(Guid startupId)
        {
            string query = @"
        SELECT p.*, 
               u.FirstName, 
               u.LastName,
               u.Email,
               s.Name as StartupName
        FROM Payments p
        JOIN Users u ON p.UserId = u.UserId
        JOIN Startups s ON p.StartupId = s.StartupId
        WHERE p.StartupId = @StartupId
        ORDER BY p.CreatedAt DESC";

            return await _db.QueryAsync(query, new { StartupId = startupId });
        }
    }
}