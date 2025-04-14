using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataStore.Abstraction.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public Guid StartupId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentStatus { get; set; } = "Pending";
        public string StripePaymentIntentId { get; set; }
        public decimal? SharesAllocated { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}