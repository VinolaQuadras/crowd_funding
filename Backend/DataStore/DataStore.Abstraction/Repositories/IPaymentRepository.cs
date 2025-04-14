using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataStore.Abstraction.Models;

namespace DataStore.Abstraction.Repositories
{
    public interface IPaymentRepository
    {

        Task<int> CreatePaymentAsync(Payment payment);
        Task UpdatePaymentStatusAsync(int paymentId, string status, decimal? sharesAllocated = null);
        Task UpdatePaymentStatusWithSharesAsync(int paymentId, string status, decimal sharesAllocated);
        Task<Payment> GetPaymentByIntentIdAsync(string intentId);
        Task<Payment> GetPaymentBySessionIdAsync(string sessionId);
        Task<IEnumerable<PaymentWithStartupInfo>> GetPaymentsByUserIdWithStartupInfoAsync(Guid userId);
        Task<PaymentWithStartupInfo> GetPaymentByIdWithStartupInfoAsync(int paymentId);
        Task<IEnumerable<dynamic>> GetPaymentsByStartupIdWithUserInfoAsync(Guid startupId);
    }

}
