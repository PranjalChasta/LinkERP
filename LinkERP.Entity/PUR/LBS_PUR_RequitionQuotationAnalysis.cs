using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
   public class LBS_PUR_RequitionQuotationAnalysis:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid RequisitionDetailID { get; set; }
        public Guid VendorID { get; set; }
        public Guid ProductID { get; set; }
        public string  ProductDescription { get; set; }
        public Guid UOM { get; set; }
        public decimal? UnitPrice { get; set; }
        public bool PreferredVendor { get; set; }
        public string ProductName { get; set; }
        public string Name { get; set; }
        public string DataName { get; set; }
    }
}
