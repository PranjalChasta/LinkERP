using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
   public  class LBS_SYS_Currency:BaseEntity
    {
        public string CurrencyCode { get; set; }
        public string CurrecnyName { get; set; }
        public int? DecimalPlaces { get; set; }
        public Guid CompanyID { get; set; }

    }
}
