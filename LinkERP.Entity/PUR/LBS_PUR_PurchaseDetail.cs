using LinkERP.Entity.INV.Inventory.Inventory_Unit_Of_Measure_Conversions;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_PurchaseDetail : BaseEntity
    {
        public Guid? CompanyID { get; set; }
        public Guid? PurchaseOrderID { get; set; }
        public int? LineNo { get; set; }
        public string PurchaseLineStatus { get; set; }
        public string ProductType { get; set; }
        public Guid? ProductID { get; set; }
        public string ProductDescription { get; set; }
        public decimal? OrderedQuantity { get; set; }
        public decimal? ReceivedQuantity { get; set; }
        public Guid? UnitOfMeasure { get; set; }
        public decimal? UnitCost { get; set; }
        public bool? DiscountType { get; set; }
        public decimal? DiscountAmount { get; set; }
        public decimal? DiscountedUnitCost { get; set; }
        public decimal? LineTotalCostTaxEclusive { get; set; }
        public string TaxID { get; set; }
        public decimal? TaxRate { get; set; }
        public decimal? LineTotalTaxAmount { get; set; }
        public decimal? LineTotalCostTaxInclusive { get; set; }
        public Guid? CurrencyID { get; set; }
        public decimal? FXRate { get; set; }
        public decimal? ForeignExchangeUnitCost { get; set; }
        public decimal? LineTotalForeignExchangeCostTaxExclusive { get; set; }
        public decimal? LineTotalForeignExchangeCostTaxInclusive { get; set; }
        public decimal? LineTotalHomeAmount { get; set; }
        public decimal? LineTotalForeignAmount { get; set; }
        public string SupplierSKU { get; set; }
        public string ClassificationID { get; set; }
        public bool? AllowPartialReceiving { get; set; }
        public string RequisitionID { get; set; }
        public string VendorPriceSchemeID { get; set; }
        public decimal? ConvertedOrderedQuantity { get; set; }
        public decimal? CovertedReceivedQuantity { get; set; }
        public decimal? HomeUnitCost { get; set; }
        public decimal? DiscountedUnitCostHome { get; set; }
        public decimal? LineTotalCostTaxExclusiveHome { get; set; }
        public decimal? LineTotalTaxAmountHome { get; set; }
        public decimal? LineTotalCostTaxInclusiveHome { get; set; }
        public decimal? DiscountedUnitCostForeign { get; set; }
        public decimal? LineTotalForeignExchangeTaxAmount { get; set; }
        public decimal? HomeConvertedUnitCost { get; set; } 
        //public IList<LBS_INV_InventoryUnitOfMeasureConversions> Uomlist { get; set; } 
        public bool? ProductStyleMatrixEnabled { get; set; } 
        public string CheckStatus { get; set; }

    }
}
