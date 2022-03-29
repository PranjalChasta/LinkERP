using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SOP_SalesPerson
    {
      public Guid ID {get;set;}
        public Guid CompanyID { get; set; }
        public string SalesPersonName { get; set; }
        public Guid WarehouseID { get; set; }
        public string CreatedBY{get;set;}
    }
}
