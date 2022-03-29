using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.ACR.DebtorAdjustment
{
  public  class LBS_ACR_DebtorAdjustmentDetail
    {
        public Guid ID { get; set; }
        public Guid CompanyID { get; set; }
        public Guid DBAdjustmentMainID { get; set; }
        public string AdjustmentReferenceNo { get; set; }
        public int LineNoo { get; set; }
        public DateTime AdjustmentDate { get; set; }
        public Guid DebtorID{ get; set; }
        public bool  WriteOnOff { get; set; }
        public decimal TransactionAmount { get; set; }
        public Guid TaxID { get; set; }
        public decimal TaxRate { get; set; }
        public decimal TaxAmount { get; set; }
        public string Reason { get; set; }
        public string AdjustmentGL { get; set; }

        public string CreatedBY { get; set; }
    }
}
