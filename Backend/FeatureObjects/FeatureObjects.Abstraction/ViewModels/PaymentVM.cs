using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FeatureObjects.Abstraction.ViewModels
{
    public class PaymentVM
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }  // Changed from int to Guid
        public Guid StartupId { get; set; } // Changed from int to Guid
        public decimal Amount { get; set; }
        public string PaymentStatus { get; set; } = "Pending";
        public string StripePaymentIntentId { get; set; }
        public decimal? SharesAllocated { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public string StartupName { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }

        //public string FullName => $"{FirstName} {LastName}";
    }
}
