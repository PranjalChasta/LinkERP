using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_SOP_OrderDetail: BaseEntity
    {
        public Guid? CompanyID { get; set; }
        public Guid SalesOrderMainID { get; set; }
        public int? LineNum { get; set; }
        public string InventoryType { get; set; }
        public string ProductID { get; set; }
        public string Description { get; set; }
        public decimal? ProductWeight { get; set; }
        public decimal? ProductCubic { get; set; }
        public int? DecimalPlaces { get; set; }
        public string InventoryGLClassification { get; set; }
        public decimal? InventoryCost { get; set; }
        public decimal TransactionQuantity { get; set; }
        public string UOM { get; set; }
        public decimal? UnitPrice { get; set; }
        public bool? DiscountType { get; set; }
        public decimal? DiscountAmount { get; set; }
        public Guid? TaxID { get; set; }
        public decimal? TaxRate { get; set; }
        public string TaxLabel { get; set; }
        public string TaxCodeName { get; set; }
        public string UOMDataName { get; set; }
        public string DiscountTypeName { get; set; }
        public string DiscountTypeValue { get; set; }
        public decimal? LineTotalExcludingTax { get; set; }
        public decimal? LineTotalTaxAmount { get; set; }
        public decimal? LineTotalIncludingTax { get; set; }
        public string WarrantyPeriod { get; set; }
        public string WarrantyNotes { get; set; }
        public decimal? DiscountTotal { get; set; }
        public decimal? DiscountGiven { get; set; }
        public string LineTotal { get; set; } 
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string AuthorisationNotes { get; set; }
        public string warehouseId { get; set; }
    }
}
