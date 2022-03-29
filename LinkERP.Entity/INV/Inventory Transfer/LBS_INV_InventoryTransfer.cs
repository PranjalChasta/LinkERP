using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory_Transfer
{
   public class LBS_INV_InventoryTransfer:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string TransferNo { get; set; }
        public Guid WareHouseFrom { get; set; }
        public Guid WareHouseTo { get; set; }
        public string WareHouseName { get; set; }
        public string TransferReason { get; set; }
        public DateTime? DateShipped { get; set; }
        public string ShippedBy { get; set; }
        public DateTime? DateReceived { get; set; }
        public string ReceivedBy { get; set; }
        public string Status { get; set; }
        public string CloseComment { get; set; } 
        public string WareHouseFromName { get; set; }
        public string WareHouseToName { get; set; }
    }
}
