using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory.Inventory_Unit_Of_Measure_Conversions
{
   public class LBS_INV_InventoryUnitOfMeasureConversions:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string InventoryID { get; set; }
        public Guid? UOMIDFrom { get; set; }
        public Guid? UOMIDTo { get; set; }
        public decimal ConversionRatio { get; set; } 
        public string ConversionRatio_text { get; set; }
        public string UOMFromName { get; set; }
        public string UOMToName { get; set; }
    }
}
