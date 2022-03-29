using LinkERP.Entity.INV.Inventory.Inventory_Unit_Of_Measure_Conversions;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.InventoryAdjustment.InventoryAdjustmentDetail
{
   public class LBS_INV_InventoryAdjustmentDetail :BaseEntity
   {
        public Guid CompanyID { get; set; }
        public Guid AdjustmentID { get; set; }
        public Guid? ProductID { get; set; }
        public Guid? UOM { get; set; }
        public decimal Quantity { get; set; }
        public bool? InOut { get; set; }
        public decimal? Cost { get; set; }
        public decimal? ExtendCost { get; set; }
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public string AdjustmentNo { get; set; }
        public bool? SerialisedProduct { get; set; }
        public bool? ProductStyleMatrixEnabled { get; set; }
        public decimal? ConvertedQuantity { get; set; } 
        public IList<LBS_INV_InventoryUnitOfMeasureConversions> Uomlist { get; set; }

        public string Quantity_text { get; set; }
        public string Cost_text { get; set; }
        public string ExtendCost_text { get; set; }
        public string ConvertedQuantity_text { get; set; }
    }
}
