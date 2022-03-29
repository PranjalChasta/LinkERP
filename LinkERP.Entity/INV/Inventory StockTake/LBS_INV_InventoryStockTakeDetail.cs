using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory_StockTake
{
   public class LBS_INV_InventoryStockTakeDetail:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid? StockTakeID { get; set; }
        public string StockTakeNo { get; set; }
        public Guid ProductID { get; set; }
        public Guid? BinNo { get; set; }
        public decimal? CurrentAvailableQuantity { get; set; }
        public decimal? CountQuantity { get; set; }
        public decimal? VarianceQuantity { get; set; }
        public decimal? Cost { get; set; }
        public decimal? TotalCostVariance { get; set; }
        public string ProductName { get; set; }
        public string BinName { get; set; }
        public string StockName { get; set; }

        public string CurrentAvailableQuantity_text { get; set; }
        public string CountQuantity_text { get; set; }
        public string VarianceQuantity_text { get; set; }
        public string Cost_text { get; set; }
        public string TotalCostVariance_text { get; set; }
        public string ProductStatus { get; set; }
    }
}
