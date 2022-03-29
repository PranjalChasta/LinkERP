using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.PUR.LandedCostPurchaseOrder
{
    public class LBS_PUR_landedCostPurcahseOrders
    {
        public Guid ID { get; set; }
        public Guid VendorID { get; set; }
        public Guid CurrencyID { get; set; }
        public Guid PurchaseLandedCostID { get; set; }
        public Guid PurchaseOrderID { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public string VendorAccountName { get; set; }
        public string CurrencyName { get; set; }
        public DateTime OrderedDate { get; set; }
        public string ForeignCurrency { get; set; }
        public bool? IsPOSelected { get; set; }

    }
}
