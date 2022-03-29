using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
   public class LBS_ACP_VendorWareHouse:BaseEntity
    {
        public string VendorID { get; set; }
        public string Description { get; set; }
        public string Adress1 { get; set; }
        public string Adress2 { get; set; }
        public string Adress3 { get; set; }
        public string Adress4 { get; set; }
        public string PostCode { get; set; }
    }
}
