using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.ACR.DebtorRefund
{
   public  class LBS_SOP_RefundMain
    {
        public Guid ID { get; set; }
        public Guid CompanyID { get; set; }
        public string RefundBatchNo { get; set; }
        public string RefundBatchDate { get; set; }
        public string Description { get; set; }
        public bool Status { get; set; }
        public string status_Text { get; set; }
        public Guid TransactionSourceID { get; set; }
        public bool GroupPayments { get; set; }
        public string CreatedBY { get; set; }
        public Guid WarehouseID { get; set; }
    }
}
