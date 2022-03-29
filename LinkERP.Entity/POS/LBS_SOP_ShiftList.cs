using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_SOP_ShiftList
    {
        public Guid ID { get; set; }
        public string Shift { get; set; }
        public string Location { get; set; }
        public DateTime OpenTime { get; set; }
        public int Count { get; set; }
        public decimal TotalSales { get; set; }
        public decimal TillTotal { get; set; }
        public string User { get; set; }
        public string Status { get; set; }
        public bool Close { get; set; }
    }
}
