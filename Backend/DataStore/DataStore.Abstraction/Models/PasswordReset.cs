using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataStore.Abstraction.Models
{
    public class PasswordReset
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public string ResetToken { get; set; } = string.Empty;
        public DateTime Expiry { get; set; }
    }
}
