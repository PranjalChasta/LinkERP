using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
  public class LBS_PUR_RequisitionStatus:BaseEntity
    {
        public int RequisitionID { get; set; }
        public string StatusName { get; set; }
    }
}
