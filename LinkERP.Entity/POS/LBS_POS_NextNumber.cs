using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_POS_NextNumber:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string Description { get; set; }
        public string WareHouseName { get; set; }
        public Guid WarehouseID { get; set; }
        public string NextNumberPrefix { get; set; }
        public string NextNumber { get; set; }

    }
}
