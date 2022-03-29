//using LinkERP.BLL.INV.Inventory.Interfaces;
using LinkERP.BLL.SHARED.Interfaces;
using LinkERP.BLL.SYS.Interfaces;
//using LinkERP.DAL.INV.Inventory.Interfaces;
using LinkERP.DAL.SHARED.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.INV.Inventory;
using LinkERP.Entity.SHARED;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class WorkFlowApproversService :IWorkFlowApproversService
    {
        IWorkFlowApproversRepository workFlowApprovers;
        public WorkFlowApproversService(IWorkFlowApproversRepository _workFlowApprovers)
        {
            workFlowApprovers = _workFlowApprovers;
        }
        public string AddWorkFlowApprover(LBS_SYS_WorkFlowApprover lBS_SYS_WorkFlowApprover)
        {
            return workFlowApprovers.AddWorkFlowApprover(lBS_SYS_WorkFlowApprover);
        }
        public string UpdateWorkFlowApprover(LBS_SYS_WorkFlowApprover lBS_SYS_WorkFlowApprover)
        {
            return workFlowApprovers.UpdateWorkFlowApprover(lBS_SYS_WorkFlowApprover);
        }
        public IList<LBS_SYS_WorkFlowApprover> GetAllWorkflowApprovers()
        {
            return workFlowApprovers.GetAllWorkflowApprovers();
        }
        public LBS_SYS_WorkFlowApprover GetWorkflowApproversByID(Guid ID)
        {
            return workFlowApprovers.GetWorkflowApproversByID(ID);
        }
        public IList<LBS_SYS_WorkFlowApprover> GetWorkflowApproversByWorkflowID(Guid ID)
        {
            return workFlowApprovers.GetWorkflowApproversByWorkflowID(ID);
        }
        public IList<LBS_SYS_WorkFlowApprover> GetLoginUsersforworkflowApprovers(Guid ID,string LoginID)
        {
            return workFlowApprovers.GetLoginUsersforworkflowApprovers(ID, LoginID);
        }
    }
}
