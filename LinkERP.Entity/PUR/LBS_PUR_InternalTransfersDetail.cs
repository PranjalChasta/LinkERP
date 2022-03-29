using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_InternalTransfersDetail :BaseEntity
    {
       
        public Guid? InternalTransferBatchID { get; set; }
        public string InternalTransferBatchNumber { get; set; }
        public Guid? CompanyID { get; set; }
        public Guid? RequisitionID { get; set; }
        public Guid? ProductID { get; set; }
        public string RequestedQuantity { get; set; }
        public Guid? WareHouseFromID { get; set; }
        public Guid? WareHouseToID { get; set; }
        public string AvailableQuantity { get; set; }
        public string TransferQuantity { get; set; }
        public string WareHouseFromName { get; set; }
        public string WareHouseToName { get; set; }
        public string RequisitionNumber { get; set; } 
        public bool? isSelect { get; set; } 

    }
}
