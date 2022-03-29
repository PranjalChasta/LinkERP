using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV
{
    public class LBS_INV_InventoryPriceLevel:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public int PriceLevel { get; set; }
        public string Description { get; set; }
    }
}
