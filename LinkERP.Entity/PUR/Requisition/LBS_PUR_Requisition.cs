using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
   public class LBS_PUR_Requisition :BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string RequisitionNumber { get; set; }
        public Guid WarehouseID { get; set; }
        public string  RequisitionStatus { get; set; }
        public DateTime? ReceiveBy { get; set; }
        public string RequestedBy { get; set; }
        public Guid? VendorID { get; set; }
        public string NextApprover { get; set; }
        public string WareHouseName { get; set; }
        public string Name { get; set; }
        public bool? isSelect { get; set; }
    }
}
