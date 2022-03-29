using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.InventoryAdjustment
{
    public class LBS_INV_InventoryAdjustment : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string AdjustmentNo { get; set; }
        public Guid? ProductID { get; set; }
        public Guid WareHouseID { get; set; }
        public string WareHouseName { get; set; }
        public string DocumentNumber { get; set; }
        public string AdjustmentReason { get; set; }
        public DateTime? DatePosted { get; set; }
        public string Status { get; set; }
       
    }
}
