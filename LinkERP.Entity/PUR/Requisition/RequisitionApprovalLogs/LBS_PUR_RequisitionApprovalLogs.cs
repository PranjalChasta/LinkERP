using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR.Requisition.RequisitionApprovalLogs
{
    public class LBS_PUR_RequisitionApprovalLogs :BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string RequisitionID { get; set; }
        public string ApprovalStatus { get; set; } 
        public string NextApprover { get; set; } 
        public string RequestedBy { get; set; }
    }
}
