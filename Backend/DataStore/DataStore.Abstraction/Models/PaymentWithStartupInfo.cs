using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataStore.Abstraction.Models
{
    public class PaymentWithStartupInfo : Payment
    {
        public string StartupName { get; set; }
    }
}
