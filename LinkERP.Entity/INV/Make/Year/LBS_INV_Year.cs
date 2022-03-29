using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Make.Year
{
  public class LBS_INV_Year:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public int year{ get; set; }
    }
}
