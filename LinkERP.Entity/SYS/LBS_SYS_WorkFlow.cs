using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_WorkFlow : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string WorkFlowCode { get; set; }
        public string WorkFlowName { get; set; }

    }
}
