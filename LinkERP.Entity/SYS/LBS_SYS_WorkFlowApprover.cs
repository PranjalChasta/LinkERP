using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_WorkFlowApprover :BaseEntity
    {
        public Guid WorkflowID { get; set; }
        public string LoginID { get; set; }
        public string LoginName { get; set; }
        public int ApproverSequence { get; set; }
        public decimal ? ApproverLimit { get; set; }
        public LBS_SYS_WorkFlow  LBS_SYS_WorkFlow { get; set; }
        public LBS_SYS_User LBS_SYS_User { get; set; }
        public string WorkFlowCode { get; set; }
        public string WorkFlowName { get; set; }
        public string ApproverLimittext { get; set; }
        

    }
}
