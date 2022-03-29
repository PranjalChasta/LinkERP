using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory.Inventory_Price_Change_Audit
{
    public class BindPriceChangeAudit
    {
       
        public string ProductName { get; set; }
        public string OldPrice { get; set; }
        public string NewPrice { get; set; }
        public string PriceChangeMachine { get; set; }
        public string PriceChangeReason { get; set; }
        public string DeleteStatus { get; set; }
    }
}
