using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV
{
    public class LBS_INV_Transfer
    {
        public Guid ID { get; set; }
        public string SourceReference { get; set; }
        public decimal Quantity { get; set; }
        public DateTime DateCreated { get; set; }
        public string WareHouseName { get; set; }
        public decimal CostIn { get; set; }
        public string AdjustmentReason { get; set; }
        public string TransactionType { get; set; }
        public int TransactionCode { get; set; }
    }
}
