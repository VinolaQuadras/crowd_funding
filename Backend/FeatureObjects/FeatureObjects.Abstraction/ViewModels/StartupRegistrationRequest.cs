using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FeatureObjects.Abstraction.ViewModels
{
    public class StartupRegistrationRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string IndustryType { get; set; }
        public decimal TotalFundingGoal { get; set; }
        public decimal EquityOffered { get; set; }
        public decimal MinInvestment { get; set; }
        public decimal? MaxInvestment { get; set; }
        public DateTime FundingDeadline { get; set; }
        public string? RefundPolicy { get; set; }

        [FromForm(Name = "pricePerShare")]
        public decimal? PricePerShare { get; set; }

        public string? InvestorPerks { get; set; }
        [FromForm(Name = "pitchDeckPath")]
        public IFormFile? PitchDeck { get; set; }

        [FromForm(Name = "logoPath")]
        public IFormFile? Logo { get; set; }

        [FromForm(Name = "bannerPath")]
        public IFormFile? Banner { get; set; }

        [FromForm(Name = "businessDocPath")]
        public IFormFile? BusinessDoc { get; set; }

        [FromForm(Name = "termsDocPath")]
        public IFormFile? TermsDoc { get; set; }
    }
}
