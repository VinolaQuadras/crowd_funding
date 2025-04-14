using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FeatureObjects.Abstraction.ViewModels
{
    public class UpdateStatusRequest
    {
        [Required]
        public string Status { get; set; }
    }

}
