using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory_Detail
{
    public class LBS_INV_Inventory :BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public Guid CategoryID { get; set; }
        public Guid SubCategoryID { get; set; }
        public Guid UnitOfMeasureID { get; set; }
        public string  InventoryDefaultCost { get; set; }
        public Guid TaxID { get; set; }
        public decimal Weight { get; set; }
        public decimal Height { get; set; }
        public decimal Width { get; set; }
        public decimal Length { get; set; }
        public Guid PriceGroupID { get; set; }
        public Guid StockTakeCycleID { get; set; }
        public string ProductStatus { get; set; }
        public bool AllowPurchase { get; set; }
        public decimal MinimumProfitPercentage { get; set; }
        public bool ProductStyleMatrixEnabled { get; set; }
        public Guid ProductStyleMatrixColumn { get; set; }
        public Guid ProductStyleMatrixRow { get; set; }
        public bool UseWareHousePrice { get; set; }
        public bool SerialisedProduct { get; set; }
        public bool BulkItem { get; set; }
        public bool AllowDiscount { get; set; }
        public bool  CustomKit { get; set; }
        public bool Websellable { get; set; }
        public int DecimalPlaces { get; set; }
        public string PrescriptionInstructions { get; set; }
        public string PrescriptionSpecialInstructions { get; set; }
        public string PrescriptionCareInstructions { get; set; }
        public string PrescriptionWarning { get; set; }
    }
}
