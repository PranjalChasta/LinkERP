using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV
{
    public class LBS_INV_WarehouseNextNumbers : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid WarehouseID { get; set; }
        public string Description { get; set; }
        public string NextNumberPrefix { get; set; }
        public int NextNumber { get; set; }
        public string Name { get; set; }
        public LBS_INV_Warehouse LBS_INV_Warehouse { get; set; }
    }
}
