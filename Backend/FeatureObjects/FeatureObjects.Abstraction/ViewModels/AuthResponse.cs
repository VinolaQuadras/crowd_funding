﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FeatureObjects.Abstraction.ViewModels
{
    public class AuthResponse
    {
        public string Token { get; set; }
        public string Role { get; set; }
    }
}
