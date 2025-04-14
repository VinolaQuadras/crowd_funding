using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FeatureObjects.Abstraction.ViewModels;

namespace FeatureObjects.Abstraction.Managers
{
    public interface IPaymentManager
    {
        Task<(string clientSecret, string sessionId)> CreatePaymentIntent(Guid userId, Guid startupId, decimal amount);
        Task<bool> HandlePaymentSuccess(string paymentIntentId);
        Task<IEnumerable<PaymentVM>> GetUserPaymentsAsync(Guid userId);
        Task<PaymentVM> GetPaymentDetailsByIdAsync(int paymentId);
        Task<IEnumerable<PaymentVM>> GetStartupPaymentsAsync(Guid startupId);


    }
}
