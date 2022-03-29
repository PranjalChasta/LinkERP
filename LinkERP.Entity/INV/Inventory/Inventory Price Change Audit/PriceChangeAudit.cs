using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory.Inventory_Price_Change_Audit
{
    public class PriceChangeAudit
    {
        public Guid CompanyID { get; set; }
        public Guid SourceID { get; set; }
        public Guid ProductID { get; set; }
        public Guid ProductName { get; set; }
        public string OldPrice { get; set; }
        public string NewPrice { get; set; }
        public string PriceChangeMachine { get; set; }
        public string PriceChangeReason { get; set; }
    }
}
