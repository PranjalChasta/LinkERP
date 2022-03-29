using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV
{
     public class LBS_INV_InventoryPriceUpdate
    {
        public Guid ID { get; set; }
        public Guid CompanyID { get; set; }
        public string PriceUpdateSchedulerNumber { get; set; }
        public Guid ProductIDFrom { get; set; }
        public Guid ProductIDTo { get; set; }
        public Guid CategoryIDFrom { get; set; }
        public Guid CategoryIDTo { get; set; }
        public Guid SubCategoryIDFrom { get; set; }
        public Guid SubCategoryIDTo { get; set; }
        public Guid? WareHouseIDFrom { get; set; }
        public Guid? WareHouseIDTo { get; set; }
        //public string WareHouseFromName { get; set; }
        //public string WareHouseToName { get; set; }
        public Guid SupplierIDFrom { get; set; }
        public Guid SupplierIDTo { get; set; }
        public bool PriceChangeLevel { get; set; }
        public string PricetoChange { get; set; }
        public bool UseExistingWareHousePrice { get; set; }
        public Guid? PriceFromWareHouse { get; set; }
        public bool IncreaseDecrease { get; set; }
        public bool PercentValue { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public string CreatedBy { get; set; }

        public string WareHouseFromName { get; set; }
        public string WareHouseToName { get; set; }
        public string CategoryNameFrom { get; set; }
        public string CategoryNameTo { get; set; }
        public string ProductName { get; set; }
        public string DeleteStatus { get; set; }
        public string PriceFromWareHouseName { get; set; }
        public string SubCategory { get; set; }
        public string CategoryName { get; set; }
    }
}
