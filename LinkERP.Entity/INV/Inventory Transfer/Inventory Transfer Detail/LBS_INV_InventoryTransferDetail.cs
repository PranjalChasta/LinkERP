using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory_Transfer.Inventory_Transfer_Detail
{
   public class LBS_INV_InventoryTransferDetail:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid TransferID { get; set; }
        public Guid ProductID  { get; set; }
        public Guid? UOM { get; set; }
        public decimal? Cost { get; set; }
        public decimal? RequestedQty { get; set; }
        public decimal? ShippedQty  { get; set; }
        public decimal? ReceivedQty { get; set; }
        public bool? SerialisedProduct { get; set; }
        public bool? ProductStyleMatrixEnabled { get; set; }
        public string UOMName { get; set; }
        public string ProductName { get; set; }
        public decimal? PreviouslyReceviedQty { get; set; }
        public decimal? UnitRequestedQty { get; set; } 
        public string Cost_text { get; set; }
        public string RequestedQty_text { get; set; }
        public string ShippedQty_text { get; set; }
        public string ReceivedQty_text { get; set; }
        public string PreviouslyReceviedQty_text { get; set; }
    }
}
