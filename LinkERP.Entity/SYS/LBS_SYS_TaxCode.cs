using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_TaxCode : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string TaxCode { get; set; }
        public string TaxCodeName { get; set; }
        public bool TaxInclusiveExclusiveFlag { get; set; }
        public bool PercentageFlag { get; set; }
        public string PercentageFlagStatus { get; set; }
        public string TaxInclusiveExclusiveFlagStatus { get; set; }
        public LBS_SYS_TaxCodeDetail LBS_SYS_TaxCodeDetail { get; set; }
        public string TaxLabel { get; set; }
    }
}
