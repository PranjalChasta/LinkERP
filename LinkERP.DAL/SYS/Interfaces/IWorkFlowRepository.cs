using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;
namespace LinkERP.DAL.SYS.Interfaces
{
    public interface IWorkFlowRepository
    {
        string AddWorkFlow(LBS_SYS_WorkFlow lBS_SYS_WorkFlow);
        string UpdateWorkFlow(LBS_SYS_WorkFlow lBS_SYS_WorkFlow);
        IList<LBS_SYS_WorkFlow> GetAllWorkFlows(Guid CompanyID);
        LBS_SYS_WorkFlow GetWorkFlowByID(Guid ID);
        string AddUpdateWorkFlowData(string lBS_SYS_WorkFlow);
    }
}
