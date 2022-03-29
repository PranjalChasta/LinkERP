using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
   public class LBS_POS_Terminals : BaseEntity
    {
        public string Description { get; set; }
        public string WareHouseName { get; set; }
        public Guid Warehouse { get; set; }
        public Guid? CompanyID { get; set; }
    }
}
