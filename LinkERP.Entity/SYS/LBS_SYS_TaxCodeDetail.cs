using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_TaxCodeDetail :BaseEntity
    {
       
        public decimal? TaxAmount { get; set; }
        public Guid? TaxCodeID { get; set; }
        public string TaxLabel { get; set; }
        public string TaxCode { get; set; }
        public string TaxCodeName { get; set; }
        public bool? TaxInclusiveExclusiveFlag { get; set; }
        public bool? PercentageFlag { get; set; }
        public LBS_SYS_TaxCode LBS_SYS_TaxCode { get; set; }
        public string TaxAmounttext { get; set; }
        public Guid CompanyID { get; set; }


    }
}
