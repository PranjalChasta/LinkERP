using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
   public class LBS_SOP_Shift :BaseEntity
    {
        //public Guid? ID{ get; set; }
        public Guid? CompanyID { get; set; }
        public string ShiftNo { get; set; }
        public string WarehouseID { get; set; }
        public DateTime? OpenDateTime { get; set; }
        public DateTime? CloseDateTime { get; set; }
        public decimal SystemTotal { get; set; }
        public decimal TillTotal { get; set; }
        public decimal Variance { get; set; }
        public string CloseAuthorisedBy { get; set; }
        public DateTime? LastReceiptTransTime { get; set; }
        public bool Printed { get; set; }
        public string BankReportNo { get; set; }
        public string Status { get; set; }
        public string CreatedBY { get; set; }
        public string Action { get; set; }
        //  public string Deleted { get; set; }
        // public string DeletedBy { get; set; }
        //public DateTime DeleteDate { get; set; }

    }
}
