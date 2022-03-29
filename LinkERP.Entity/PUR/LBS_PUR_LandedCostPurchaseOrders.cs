using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
   public class LBS_PUR_LandedCostPurchaseOrders:BaseEntity
    {
        public Guid VendorID { get; set; }
        public Guid CompanyID { get; set; }
        public Guid PurchaseID { get; set; }
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
