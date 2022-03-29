using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV
{
    public class LBS_INV_TransactionHistory
    {
        public Guid ID { get; set; }
        public string SourceReference { get; set; }
        public decimal Quantity { get; set; }
        public DateTime DateCreated { get; set; }
        public string WareHouseName { get; set; }
        public decimal CostIn { get; set; } 
        public decimal CostOut { get; set; }
        public string Reason { get; set; }
        public string TransactionType { get; set; }
        public int TransactionCode { get; set; }
    }
}
