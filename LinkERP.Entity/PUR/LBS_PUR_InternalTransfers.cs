using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_InternalTransfers:BaseEntity
    {
        public string InternalTransferBatchNumber { get; set; }
        public Guid? CompanyID { get; set; }
        public Guid? RequisitionID { get; set; }
        public int? LineNo { get; set; }
        public Guid? ProductID { get; set; }
        public string RequestedQuantity { get; set; }
        public Guid? WareHouseID { get; set; }
        public string AvailableQuantity { get; set; }
        public string TransferQuantity { get; set; }
        public string TransferNo { get; set; }
        public string ProductName { get; set; }
        public string WareHouseName { get; set; } 
        public bool? BatchStatus { get; set; }
        public bool? IsSelect { get; set; } 
        public string BatchStatusText { get; set; }
    }
}
