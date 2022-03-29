using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
   public class LBS_SYS_Country :BaseEntity
    {
        public Guid CountryID { get; set; }
        public  string CountryCode { get; set; }
        public string Name { get; set; }
        
    }
}
