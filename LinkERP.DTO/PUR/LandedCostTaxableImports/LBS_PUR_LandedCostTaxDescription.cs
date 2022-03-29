using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.PUR.LandedCostTaxableImports
{
    public class LBS_PUR_LandedCostTaxDescription
    {
        public Guid ID { get; set; }
        public string TaxCode { get; set; }
        public string TaxCodeName { get; set; }
        public string TaxLabel { get; set; }
        public decimal TaxRate { get; set; }

    }
}
