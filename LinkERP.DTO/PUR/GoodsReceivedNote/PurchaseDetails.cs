using LinkERP.Entity.PUR;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.PUR.GoodsReceivedNote
{
    public class PurchaseDetails : LBS_PUR_PurchaseDetail
    {
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public decimal? TotalReceivedQuantity { get; set; }

        public string Barcode { get; set; }
        public string VendorSKU { get; set; }
        public string VendorBarCode { get; set; }

    }
}
