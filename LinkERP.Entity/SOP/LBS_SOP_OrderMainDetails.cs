using LinkERP.Entity.INV;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SOP
{
   public class LBS_SOP_OrderMainDetails: LBS_INV_Inventory
    {
        public string TaxLabel { get; set; }
        public decimal? TaxAmount { get; set; }
        public string TaxCodeID { get; set; }
        public string TaxCodeName { get; set; }
        public decimal AvailableQuantity { get; set; }
        public decimal Quantity { get; set; }
    }
}
