using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory.Inventory_Barcode
{
    public class LBS_INV_InventoryBarCode:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string InventoryID { get; set; }
        public string Barcode { get; set; }
    }
}
