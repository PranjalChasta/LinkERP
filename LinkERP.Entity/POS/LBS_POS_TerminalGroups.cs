using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_POS_TerminalGroups:BaseEntity
    {
        public string GroupName { get; set; }
        public Guid TerminalID { get; set; }
        public Guid CompanyID { get; set; }
    }
}
