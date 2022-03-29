using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory.Inventory_Automative
{
   public class LBS_INV_InventoryAutomotive:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid ProductID { get; set; }
        public Guid MakeID { get; set; }
        public Guid ModelID { get; set; }
        public Guid Year { get; set; }
        public Guid Series { get; set; }
        public Guid Engine { get; set; }
        public string MakeName { get; set; }
        public string ModelName { get; set; }
        public string SeriesName { get; set; }
        public string EngineName { get; set; }
        public string name { get; set; }
    }
}
