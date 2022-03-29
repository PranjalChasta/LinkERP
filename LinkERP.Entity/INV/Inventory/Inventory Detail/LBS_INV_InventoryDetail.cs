using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory
{
    public class LBS_INV_InventoryDetail :BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string ProductID { get; set; }
        public Guid? WarehouseID { get; set; }
        public string WareHouseName { get; set; }
        public Guid? BinID { get; set; }
        public string BinName { get; set; }
        public decimal? MinimumStock { get; set; }
        public decimal? MaximumStock { get; set; }
        public decimal? MinimumOrder { get; set; }
        public decimal? AverageCost { get; set; }
        public decimal? StandardCost { get; set; }
        public decimal? LastCost { get; set; }
        public decimal? AvailableQuantity { get; set; }
        public string InventoryGLClassificationID { get; set; }
        public bool? AllowNegative { get; set; }
        public string AllowNegativeStatus { get; set; }  
        public LBS_INV_Warehouse  LBS_INV_Warehouse { get; set; }
        public LBS_INV_WareHouseBin LBS_INV_WareHouseBin { get; set; }

        public string MinimumStock_text { get; set; }
        public string MaximumStock_text { get; set; }
        public string MinimumOrder_text { get; set; }
        public string AverageCost_text { get; set; }
        public string StandardCost_text { get; set; }
        public string LastCost_text { get; set; }
        public string AvailableQuantity_text { get; set; }
    }
}
