using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory.Inventory_Kit
{
    public class LBS_INV_InventoryKitComponent :BaseEntity
    {
        public Guid KitProductID { get; set; }
        public Guid? CompanyID { get; set; }
        public Guid? ParentProductID { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? ConversionRatio { get; set; }
        public LBS_INV_Inventory LBS_INV_Inventory { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }

        public string Quantity_text { get; set; }
        public string ConversionRatio_text { get; set; }
    }
}
