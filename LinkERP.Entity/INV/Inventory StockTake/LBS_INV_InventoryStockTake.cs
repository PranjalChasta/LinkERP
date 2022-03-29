using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory_StockTake
{
    public class LBS_INV_InventoryStockTake:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string StockTakeNo { get; set; }
        public Guid WareHouseID { get; set; }
        public string CycleID { get; set; }
        public Guid? ProductIDStart { get; set; }
        public Guid? ProductIDEnd { get; set; }
        public Guid? CategoryIDStart { get; set; }
        public Guid? CategoryIDEnd { get; set; }
        public Guid? SubCategoryIDStart { get; set; }
        public Guid? SubCategoryIDEnd { get; set; }
        public Guid? BinIDStart { get; set; }
        public Guid? BinIDEnd { get; set; }
        public string StockTakeStatus { get; set; }
        public string WareHouseName { get; set; }
        public string ProductName { get; set; }
        public string ProductEndName { get; set; }
        public string Cyclename { get; set; }
        public string Cyclecode { get; set; }
    }
}
