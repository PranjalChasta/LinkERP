using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory.Inventory_WareHouse_Price
{
   public class LBS_INV_InventoryWareHousePrice :Common_Product_Price
    {
        public Guid CompanyID { get; set; }
        public Guid WareHouseID { get; set; }
        public string ProductID { get; set; }
    }
}
