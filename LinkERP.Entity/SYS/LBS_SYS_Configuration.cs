using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_Configuration :BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string Flag { get; set; }
        public string FlagName { get; set; }
        public string Value { get; set; }
        public string ModuleId { get; set; }
        public string ModuleName { get; set; }
        public string Name { get; set; }
    }
}
