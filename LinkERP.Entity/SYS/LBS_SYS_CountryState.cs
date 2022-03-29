using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_CountryState :BaseEntity
    {
        public Guid StateID { get; set; }
        public Guid CountryID { get; set; }
        public string StateCode { get; set; }
        public string Name { get; set; }
        public string CountryName { get; set; }
    }
}
