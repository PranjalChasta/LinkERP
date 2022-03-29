using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_CountryStateCity :BaseEntity
    {
        public Guid CityID { get; set; }
        public Guid CountryID { get; set; }
        public Guid StateID { get; set; }
        public string CityCode { get; set; }
        public string Name { get; set; }
        public string States { get; set; }
        public string CountryName { get; set; }

    }
}
