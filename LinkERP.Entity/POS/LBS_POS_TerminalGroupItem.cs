using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_POS_TerminalGroupItem:BaseEntity
    {
        public Guid ProductID { get; set; }
        public string ProductName { get; set; }
        public Guid GroupID { get; set; }
        public Guid CompanyID { get; set; }
    }
}
