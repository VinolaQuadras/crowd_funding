
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataStore.Abstraction.Models;
using DataStore.Abstraction.Repositories;
using FeatureObjects.Abstraction.Managers;
using FeatureObjects.Abstraction.ViewModels;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;

namespace FeatureObjects.Implementation.Managers
{
    public class PaymentManager : IPaymentManager
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IStartupRepository _startupRepository;
        private readonly string _stripeSecretKey;

        public PaymentManager(
            IPaymentRepository paymentRepository,
            IStartupRepository startupRepository,
            IConfiguration configuration)
        {
            _paymentRepository = paymentRepository;
            _startupRepository = startupRepository;
            _stripeSecretKey = configuration["Stripe:SecretKey"];

            StripeConfiguration.ApiKey = _stripeSecretKey;
        }

        public async Task<(string clientSecret, string sessionId)> CreatePaymentIntent(Guid userId, Guid startupId, decimal amount)
        {
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = "usd",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = "Investment",
                            },
                            UnitAmount = (long)(amount * 100),
                        },
                        Quantity = 1,
                    }
                },
                Mode = "payment",
                SuccessUrl = "http://localhost:5173/success",
                CancelUrl = "http://localhost:5173/cancel",
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);


            var payment = new Payment
            {
                UserId = userId,
                StartupId = startupId,
                Amount = amount,
                PaymentStatus = "Pending",
                StripePaymentIntentId = session.Id,
                SharesAllocated = null,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _paymentRepository.CreatePaymentAsync(payment);

            return (session.PaymentIntentId, session.Id);
        }

        public async Task<bool> HandlePaymentSuccess(string paymentIntentId)
        {
            var payment = await _paymentRepository.GetPaymentBySessionIdAsync(paymentIntentId);


            if (payment == null)
            {
                return false;
            }


            var startup = await _startupRepository.GetStartupByIdAsync(payment.StartupId);
            if (startup == null || !startup.PricePerShare.HasValue || startup.PricePerShare.Value <= 0)
            {

                await _paymentRepository.UpdatePaymentStatusAsync(payment.Id, "Success", null);
                return true;
            }


            decimal sharesAllocated = payment.Amount / startup.PricePerShare.Value;


            await _paymentRepository.UpdatePaymentStatusWithSharesAsync(
                payment.Id,
                "Success",
                sharesAllocated);

            return true;
        }
        public async Task<PaymentVM?> GetPaymentDetailsByIdAsync(int paymentId)
        {
            var payment = await _paymentRepository.GetPaymentByIdWithStartupInfoAsync(paymentId);
            if (payment == null) return null;
            return new PaymentVM
            {
                Id = payment.Id,
                UserId = payment.UserId,
                StartupId = payment.StartupId,
                Amount = payment.Amount,
                PaymentStatus = payment.PaymentStatus,
                StripePaymentIntentId = payment.StripePaymentIntentId,
                SharesAllocated = payment.SharesAllocated,
                CreatedAt = payment.CreatedAt,
                UpdatedAt = payment.UpdatedAt,
                StartupName = payment.StartupName
            };
        }

        public async Task<IEnumerable<PaymentVM>> GetUserPaymentsAsync(Guid userId)
        {
            var payments = await _paymentRepository.GetPaymentsByUserIdWithStartupInfoAsync(userId);
            if (payments == null || !payments.Any()) return Enumerable.Empty<PaymentVM>();

            return payments.Select(payment => new PaymentVM
            {
                Id = payment.Id,
                UserId = payment.UserId,
                StartupId = payment.StartupId,
                Amount = payment.Amount,
                PaymentStatus = payment.PaymentStatus,
                StripePaymentIntentId = payment.StripePaymentIntentId,
                SharesAllocated = payment.SharesAllocated,
                CreatedAt = payment.CreatedAt,
                UpdatedAt = payment.UpdatedAt,
                StartupName = payment.StartupName
            });
        }
        public async Task<IEnumerable<PaymentVM>> GetStartupPaymentsAsync(Guid startupId)
        {
            var payments = await _paymentRepository.GetPaymentsByStartupIdWithUserInfoAsync(startupId);
            if (payments == null || !payments.Any()) return Enumerable.Empty<PaymentVM>();

            return payments.Select(payment => new PaymentVM
            {
                Id = payment.Id,
                UserId = payment.UserId,
                StartupId = payment.StartupId,
                Amount = payment.Amount,
                PaymentStatus = payment.PaymentStatus,
                StripePaymentIntentId = payment.StripePaymentIntentId,
                SharesAllocated = payment.SharesAllocated,
                CreatedAt = payment.CreatedAt,
                UpdatedAt = payment.UpdatedAt,
                StartupName = payment.StartupName,
                FirstName = payment.FirstName,
                LastName = payment.LastName,
                Email = payment.Email
            });
        }
    }
}

