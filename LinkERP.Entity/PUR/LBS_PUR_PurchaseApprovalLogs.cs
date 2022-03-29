using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_PurchaseApprovalLogs:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid PurchaseOrderID { get; set; }
        public int ApprovalStatus { get; set; }
        public string DateCreated { get; set; }
        public string StatusName { get; set; }
        public string Description { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public string NextApprover { get; set; }
        public string ExpectedDeliveryDate { get; set; }
        public string WareHouseName { get; set; }
        public decimal Amount { get; set; }
    }
}
