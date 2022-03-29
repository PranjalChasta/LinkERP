using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_QuoteAnalysis:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid RequisitionDetailID { get; set; }
        public int LineNo { get; set; }
        public Guid RequisitionID { get; set; }
        public Guid VendorID { get; set; }
        public string Vendor { get; set; }
        public string VendorName { get; set; }
        public Guid ProductID { get; set; }
        public string Product { get; set; }
        public string ProductDescription { get; set; }
        public string UOM { get; set; }
        public decimal UnitPrice { get; set; }
        public bool PreferredVendor { get; set; }
    }
}
