using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
   public class LBS_PUR_PurchaseTemplate:BaseEntity
    {
        public string Description { get; set; }
        public Guid CompanyID { get; set; }
        public Guid? VendorID { get; set; }
        public Guid? WarehouseID { get; set; }
        public Guid? VendorWareHouseID { get; set; }
        public string Attentionto  { get; set; }
        public string AttentionPhone { get; set; }
        public string WareHouseName { get; set; }
        public string VendorAccountName { get; set; }
        public Guid? Category { get; set; }
        public Guid? SubCategory { get; set; }
    }
}
