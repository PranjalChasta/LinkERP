using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_SOP_QuotationDetailTaxLabels:BaseEntity
    {
        public Guid? CompanyID { get; set; }
        public Guid? QuotationLineID { get; set; }
        public Guid? TaxID { get; set; }
        public string TaxLabel { get; set; }
        public decimal TaxAmount { get; set; }

    }
}
