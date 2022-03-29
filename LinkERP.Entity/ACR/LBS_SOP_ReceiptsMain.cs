using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.AR
{
    public class LBS_SOP_ReceiptsMain
    {
        public Guid ID { get; set; }
        public Guid CompanyID { get; set; }
        public string ReceiptBatchNo { get; set; }
        public DateTime ReceiptBatchDate { get; set; }
        public string Description { get; set; }
        public bool Status { get; set; }
        public string Status_Text { get; set; }
        public Guid TransactionSourceID { get; set; }
        public bool GroupPayments { get; set; }
        public string CreatedBY { get; set; }
        public bool Deleted { get; set; }
        public string DeletedBy { get; set; }
        public DateTime DeleteDate { get; set; }
        public Guid WarehouseID { get; set; }
    }
}
