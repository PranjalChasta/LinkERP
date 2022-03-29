using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.INV.DataSearch.Products
{
    public class InventoryDetails
    {
        public Guid ID { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string Barcode { get; set; }
        public string VendorSKU { get; set; }
        public string VendorBarCode { get; set; }
        public string ProductStatus { get; set; }
        public bool ProductStyleMatrixEnabled { get; set; }
        public bool SerialisedProduct { get; set; }
        public bool CustomKit { get; set; }
    }
}
