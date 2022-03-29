using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SHARED
{
    public class CompaniesPermissions
    { 
        public Guid ID { get; set; }
        public string CompanyCode { get; set; }
        public string Logo { get; set; }
        public string Name { get; set; }
        public string TradingName { get; set; } 
    }
}
