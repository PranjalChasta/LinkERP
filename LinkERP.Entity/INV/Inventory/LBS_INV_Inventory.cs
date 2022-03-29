using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV
{
    public class LBS_INV_Inventory :BaseEntity
    {
        public Guid? CompanyID { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public Guid? CategoryID { get; set; }
        public Guid? SubCategoryID { get; set; }
        public Guid? UnitOfMeasureID { get; set; }
        public string InventoryDefaultCost { get; set; }
        public Guid? TaxID { get; set; }
        public decimal? Weight { get; set; }
        public decimal? Height { get; set; }
        public decimal? Width { get; set; }
        public decimal? Length { get; set; }
        public string Weight_text { get; set; }
        public string Height_text { get; set; }
        public string Width_text { get; set; }
        public string Length_text { get; set; }
        public Guid? PriceGroupID { get; set; }
        public Guid? StocktakeCycleID { get; set; }
        public string ProductStatus { get; set; }
        public bool? AllowPurchase { get; set; }
        public decimal? MinimumProfitPercentage { get; set; }
        public bool? ProductStyleMatrixEnabled { get; set; }
        public Guid? ProductStyleMatrixColumn { get; set; }
        public Guid? ProductStyleMatrixRow { get; set; }
        public bool? UseWareHousePrice { get; set; }
        public bool? SerialisedProduct { get; set; }
        public bool? BulkItem { get; set; }
        public bool? AllowDiscount { get; set; }
        public bool? CustomKit { get; set; }
        public bool? Websellable { get; set; } 
        public bool? GiftVoucher { get; set; }
        public int? DecimalPlaces { get; set; }
        public string PrescriptionInstructions { get; set; }
        public string PrescriptionSpecialInstructions { get; set; }
        public string PrescriptionCareInstructions { get; set; }
        public string PrescriptionWarning { get; set; }
        public string CategoryName { get; set; }
        public string SubCategoryName { get; set; }
        public string UOMName { get; set; } 
        public string AllowPurchase_text { get; set; } 
        public string UseWareHousePrice_text { get; set; }
        public string SerialisedProduct_text { get; set; }
        public string BulkItem_text { get; set; }
        public string AllowDiscount_text { get; set; }
        public string CustomKit_text { get; set; }
        public string Websellable_text { get; set; }
        public string GiftVoucher_text { get; set; }
        public string ProductStatus_text { get; set; }
        public string CycleName { get; set; }
        public string CycleCode { get; set; } 
        public bool? UseExpiryDates { get; set; }
        public Guid? ProductGroup { get; set; }
        public Guid? ProductGroup2 { get; set; }
        public Guid? ProductGroup3 { get; set; }
        public decimal? WarrantyPeriod { get; set; }
        public Guid? WarrantyFrequency { get; set; }
        public string WarrantyTerms { get; set; }

    }
}
