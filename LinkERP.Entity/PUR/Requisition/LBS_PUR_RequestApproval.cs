using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR.Requisition
{
    public class LBS_PUR_RequestApproval : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string RequisitionNumber { get; set; }
        public Guid WarehouseID { get; set; }
        public string RequisitionStatus { get; set; }
        public string ReceiveBy { get; set; }
        public string RequestedBy { get; set; }
        public int Amount { get; set; }
        public string NextApprover { get; set; }
        public string WareHouseName { get; set; } 
    }
}
