using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SHARED
{
    public class WarehousesPermissions
    {  
        public Guid CompanyID { get; set; } 
        public Guid? WarehouseID { get; set; } 
        public string WareHouseName { get; set; }
        public Guid? DefaultWarehousebin { get; set; }
    }
}
