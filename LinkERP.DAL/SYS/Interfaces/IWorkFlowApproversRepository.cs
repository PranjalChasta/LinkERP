using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface IWorkFlowApproversRepository
    {
        string AddWorkFlowApprover(LBS_SYS_WorkFlowApprover lBS_SYS_WorkFlowApprover);
        string UpdateWorkFlowApprover(LBS_SYS_WorkFlowApprover lBS_SYS_WorkFlowApprover);
        IList<LBS_SYS_WorkFlowApprover> GetAllWorkflowApprovers();
        LBS_SYS_WorkFlowApprover GetWorkflowApproversByID(Guid ID);
        IList<LBS_SYS_WorkFlowApprover> GetWorkflowApproversByWorkflowID(Guid ID);
        IList<LBS_SYS_WorkFlowApprover> GetLoginUsersforworkflowApprovers(Guid ID,string LoginID);
    }
}
