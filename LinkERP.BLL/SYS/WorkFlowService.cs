using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class WorkFlowService :IWorkFlowService
    {
        IWorkFlowRepository workFlow;
        public WorkFlowService(IWorkFlowRepository _workFlow)
        {
            workFlow = _workFlow;
        }
        public string AddWorkFlow(LBS_SYS_WorkFlow lBS_SYS_WorkFlow)
        {
            return workFlow.AddWorkFlow(lBS_SYS_WorkFlow);
        }
        public string UpdateWorkFlow(LBS_SYS_WorkFlow lBS_SYS_WorkFlow)
        {
            return workFlow.UpdateWorkFlow(lBS_SYS_WorkFlow);
        }
        public IList<LBS_SYS_WorkFlow> GetAllWorkFlows(Guid CompanyID)
        {
            return workFlow.GetAllWorkFlows(CompanyID);
        }
        public LBS_SYS_WorkFlow GetWorkFlowByID(Guid ID)
        {
            return workFlow.GetWorkFlowByID(ID);
        }
        public string AddUpdateWorkFlowData(string lBS_SYS_WorkFlow)
        {
            return workFlow.AddUpdateWorkFlowData(lBS_SYS_WorkFlow);
        }
    }
}
