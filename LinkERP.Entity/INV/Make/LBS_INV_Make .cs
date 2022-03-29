using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Make
{
    public class LBS_INV_Make:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string MakeDescription { get; set; }
    }
}
