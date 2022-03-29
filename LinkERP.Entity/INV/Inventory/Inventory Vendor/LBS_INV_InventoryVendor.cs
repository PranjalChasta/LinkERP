using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory.Inventory_Vendor
{
   public class LBS_INV_InventoryVendor:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid InventoryID { get; set; }
        public Guid? VendorID { get; set; }
        public Guid? PurchaseUOM { get; set; }
        public string VendorBarCode { get; set; }
        public Guid? VendorWareHouse { get; set; }
        public bool? Default { get; set; }
        public DateTime? LastPurchasedDate { get; set; }
        public string DateCreated { get; set; }
        public decimal? LastPurchasedUnitPrice { get; set; }
        public  string LastPurchasedUnitPrice_text { get; set; }
        public string VendorSKU { get; set; }
        public string VendorAccountName { get; set; }
        public string PurchaseUOMName { get; set; }
        public string DefaultStatus { get; set; }
    }
}
