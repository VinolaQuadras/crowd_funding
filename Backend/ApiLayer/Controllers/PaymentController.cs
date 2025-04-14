

using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using FeatureObjects.Abstraction.Managers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;

namespace ApiLayer.Controllers
{
    [Route("api/payments")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentManager _paymentManager;
        private readonly IConfiguration _configuration;


        public PaymentController(
            IPaymentManager paymentManager,
            IConfiguration configuration)

        {
            _paymentManager = paymentManager;
            _configuration = configuration;

        }

        [HttpPost("create-intent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentRequest request)
        {
            var (clientSecret, sessionId) = await _paymentManager.CreatePaymentIntent(
                request.UserId, request.StartupId, request.Amount);

            if (string.IsNullOrEmpty(sessionId))
            {
                return BadRequest("Failed to create Stripe session.");
            }
            return Ok(new { clientSecret, sessionId });
        }

        [HttpPost("confirm-payment")]
        public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmPaymentRequest request)
        {
            bool isSuccess = await _paymentManager.HandlePaymentSuccess(request.PaymentIntentId);
            return isSuccess ? Ok("Payment Successful") : BadRequest("Payment Failed");
        }

        [HttpGet("publishable-key")]
        public IActionResult GetStripePublishableKey()
        {
            var publishableKey = _configuration["Stripe:PublishableKey"];
            if (string.IsNullOrEmpty(publishableKey))
            {
                return BadRequest("Stripe Publishable Key is not configured.");
            }
            return Ok(new { publishableKey });
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserPayments(Guid userId)
        {
            if (userId == Guid.Empty)
            {
                return BadRequest("Invalid user ID");
            }

            try
            {
                var payments = await _paymentManager.GetUserPaymentsAsync(userId);


                var result = payments.Select(p => new
                {
                    id = p.Id,
                    userId = p.UserId,
                    startupId = p.StartupId,
                    startupName = p.StartupName,
                    amount = p.Amount,
                    paymentStatus = p.PaymentStatus,
                    stripePaymentIntentId = p.StripePaymentIntentId,
                    sharesAllocated = p.SharesAllocated,
                    createdAt = p.CreatedAt,
                    updatedAt = p.UpdatedAt
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{paymentId}")]
        public async Task<IActionResult> GetPaymentDetails(int paymentId)
        {
            if (paymentId <= 0)
            {
                return BadRequest("Invalid payment ID");
            }

            try
            {
                var payment = await _paymentManager.GetPaymentDetailsByIdAsync(paymentId);

                if (payment == null)
                {
                    return NotFound("Payment not found");
                }

                var result = new
                {
                    id = payment.Id,
                    userId = payment.UserId,
                    startupId = payment.StartupId,
                    startupName = payment.StartupName,
                    amount = payment.Amount,
                    paymentStatus = payment.PaymentStatus,
                    stripePaymentIntentId = payment.StripePaymentIntentId,
                    sharesAllocated = payment.SharesAllocated,
                    createdAt = payment.CreatedAt,
                    updatedAt = payment.UpdatedAt
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            const string secret = "whsec_e7da4bde36d9d55cc3c6d7959ebbfc052a2ac1b1f3a95c15d01256b5dd347545"; // Replace with actual Stripe webhook secret
            try
            {
                var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], secret);
                if (stripeEvent.Type == "checkout.session.completed")
                {
                    var session = stripeEvent.Data.Object as Session;
                    if (session != null)
                    {

                        await _paymentManager.HandlePaymentSuccess(session.Id);
                    }
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Webhook Error: {ex.Message}");
            }
        }

        [HttpGet("startup/{startupId}")]
        public async Task<IActionResult> GetStartupPayments(Guid startupId)
        {
            if (startupId == Guid.Empty)
            {
                return BadRequest("Invalid startup ID");
            }

            try
            {
                var payments = await _paymentManager.GetStartupPaymentsAsync(startupId);


                var result = payments.Select(p => new
                {
                    id = p.Id,
                    userId = p.UserId,
                    firstName = p.FirstName,
                    lastName = p.LastName,
                    email = p.Email,
                    startupId = p.StartupId,
                    startupName = p.StartupName,
                    amount = p.Amount,
                    paymentStatus = p.PaymentStatus,
                    stripePaymentIntentId = p.StripePaymentIntentId,
                    sharesAllocated = p.SharesAllocated,
                    createdAt = p.CreatedAt,
                    updatedAt = p.UpdatedAt
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    public class PaymentRequest
    {
        public Guid UserId { get; set; }
        public Guid StartupId { get; set; }
        public decimal Amount { get; set; }
    }

    public class ConfirmPaymentRequest
    {
        public string PaymentIntentId { get; set; }
    }
}












