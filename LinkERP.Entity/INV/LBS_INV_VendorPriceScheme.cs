using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV
{
    public class LBS_INV_VendorPriceScheme :BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid VendorID { get; set; }
        public string DealsType { get; set; }
        public Guid ProductID { get; set; }
        public string ProductDescription { get; set; }
        public decimal Quantity { get; set; }
        public Guid UOM { get; set; }
        public decimal? SupplierUnitPrice { get; set; }
        public bool? DiscountType { get; set; }
        public decimal? DiscountValue { get; set; }
        public decimal? FreeDealsQuantity { get; set; }
        public string SupplierUnitPrice_text { get; set; }
        public string DiscountValue_text { get; set; }
        public string Quantity_text { get; set; }
        public string FreeDealsQuantity_text { get; set; }
        public string FreeDealsUOM { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public decimal? FreeDealsQuantityRedeemed { get; set; }
        public string Status { get; set; }
        public string CompanyName { get; set; }
        public string UOMCode { get; set; }
        public string UOMName { get; set; }
        public string Name { get; set; }
        public string DataName { get; set; }
        public string ProductName { get; set; }
        public string DiscountTypestatus { get; set; }
    }
}
