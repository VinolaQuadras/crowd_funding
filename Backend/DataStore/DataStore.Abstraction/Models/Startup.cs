﻿
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataStore.Abstraction.Models
{
    public class Startup
    {
        public Guid StartupId { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string IndustryType { get; set; }
        public string? PitchDeckPath { get; set; }
        public string? LogoPath { get; set; }
        public string? BannerPath { get; set; }
        public decimal TotalFundingGoal { get; set; }
        public decimal EquityOffered { get; set; }
        public decimal PreMoneyValuation { get; set; }
        public decimal? PricePerShare { get; set; }
        public decimal MinInvestment { get; set; }
        public decimal? MaxInvestment { get; set; }
        public DateTime FundingDeadline { get; set; }
        public string? RefundPolicy { get; set; }
        public string? InvestorPerks { get; set; }
        public string? BusinessDocPath { get; set; }
        public string? TermsDocPath { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public decimal TotalInvestment { get; set; }
    }
}
