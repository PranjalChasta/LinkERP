using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV
{
    public class LBS_INV_UnitOfMeasure:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string UOMCode { get; set; }
        public string UOMName { get; set; }
    }
}
