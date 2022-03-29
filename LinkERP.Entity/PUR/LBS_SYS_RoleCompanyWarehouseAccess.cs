using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_SYS_RoleCompanyWarehouseAccess:BaseEntity
    { 
        public Guid CompanyID { get; set; }
        public Guid RoleID { get; set; }
        public Guid? WarehouseID { get; set; } 
        public string WareHouseCode { get; set; }
        public string WareHouseName { get; set; }
        public string CompanyCode { get; set; }
        public string Name { get; set; }

    }
}
