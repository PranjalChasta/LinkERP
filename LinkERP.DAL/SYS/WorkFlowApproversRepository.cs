using Dapper;
//using LinkERP.DAL.INV.Inventory.Interfaces;
using LinkERP.DAL.SHARED.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.INV.Inventory;
using LinkERP.Entity.SHARED;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
namespace LinkERP.DAL.SYS
{
    public class WorkFlowApproversRepository :BaseRepository,IWorkFlowApproversRepository
    {
        //public string AddWorkFlowApprover (LBS_SYS_WorkFlowApprover lBS_SYS_WorkFlowApprover)
        //{
        //    DynamicParameters parameters = new DynamicParameters();
        //    parameters.Add("@WorkflowID", lBS_SYS_WorkFlowApprover.WorkflowID);
        //    parameters.Add("@LoginID", lBS_SYS_WorkFlowApprover.LoginID);
        //    parameters.Add("@ApproverSequence", lBS_SYS_WorkFlowApprover.ApproverSequence);
        //    parameters.Add("@ApproverLimit", lBS_SYS_WorkFlowApprover.ApproverLimit);
        //    parameters.Add("@CreatedBY", lBS_SYS_WorkFlowApprover.CreatedBY);
        //    parameters.Add("@Action", ActionsForSP.Add.GetDescription());
        //    parameters.Add("@WorkflowApproverID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
        //    parameters.Add("@WorkFlowResponse", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
        //    parameters.Add("@NextNumber", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
        //    SqlMapper.Query(con, "SYS_WorkFlowApproversManagement",
        //                    param: parameters,
        //                    commandType: CommandType.StoredProcedure);
        //    var id = parameters.Get<string>("@WorkflowApproverID");
        //    var number = parameters.Get<string>("@NextNumber");
        //    var msg = parameters.Get<string>("@WorkFlowResponse");
        //    if (msg == "Duplicate")
        //    {
        //        msg = "Approver Number Already Exists Available Next Number is " + number;
        //    }
        //    else
        //    {
        //        msg = "Success";
        //    }
        //    return msg;
        //}
        public string AddWorkFlowApprover(LBS_SYS_WorkFlowApprover lBS_SYS_WorkFlowApprover)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@WorkflowID", lBS_SYS_WorkFlowApprover.WorkflowID);
            parameters.Add("@WorkflowID", lBS_SYS_WorkFlowApprover.WorkflowID);
            parameters.Add("@LoginID", lBS_SYS_WorkFlowApprover.LoginID);
            parameters.Add("@ApproverSequence", lBS_SYS_WorkFlowApprover.ApproverSequence);
            parameters.Add("@ApproverLimit", lBS_SYS_WorkFlowApprover.ApproverLimit);
            parameters.Add("@CreatedBY", lBS_SYS_WorkFlowApprover.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Add.GetDescription());
            parameters.Add("@WorkflowApproverID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_WorkFlowApproversManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@WorkflowApproverID");
            return id;
        }
        public string UpdateWorkFlowApprover(LBS_SYS_WorkFlowApprover lBS_SYS_WorkFlowApprover)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", lBS_SYS_WorkFlowApprover.ID);
            parameters.Add("@WorkflowID", lBS_SYS_WorkFlowApprover.WorkflowID);
            parameters.Add("@LoginID", lBS_SYS_WorkFlowApprover.LoginID);
            parameters.Add("@ApproverSequence", lBS_SYS_WorkFlowApprover.ApproverSequence);
            parameters.Add("@ApproverLimit", lBS_SYS_WorkFlowApprover.ApproverLimit);
            parameters.Add("@CreatedBY", lBS_SYS_WorkFlowApprover.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Edit.GetDescription());
            parameters.Add("@WorkflowApproverID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_WorkFlowApproversManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@WorkflowApproverID");
            return id;
        }
        //public string UpdateWorkFlowApprover(LBS_SYS_WorkFlowApprover lBS_SYS_WorkFlowApprover)
        //{
        //    DynamicParameters parameters = new DynamicParameters();
        //    parameters.Add("@ID", lBS_SYS_WorkFlowApprover.ID);
        //    parameters.Add("@WorkflowID", lBS_SYS_WorkFlowApprover.WorkflowID);
        //    parameters.Add("@LoginID", lBS_SYS_WorkFlowApprover.LoginID);
        //    parameters.Add("@ApproverSequence", lBS_SYS_WorkFlowApprover.ApproverSequence);
        //    parameters.Add("@ApproverLimit", lBS_SYS_WorkFlowApprover.ApproverLimit);
        //    parameters.Add("@CreatedBY", lBS_SYS_WorkFlowApprover.CreatedBY);
        //    parameters.Add("@Action", ActionsForSP.Edit.GetDescription());
        //    parameters.Add("@WorkflowApproverID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
        //    parameters.Add("@WorkFlowResponse", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
        //    parameters.Add("@NextNumber", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
        //    SqlMapper.Query(con, "SYS_WorkFlowApproversManagement",
        //                    param: parameters,
        //                    commandType: CommandType.StoredProcedure);
        //    var id = parameters.Get<string>("@WorkflowApproverID");
        //    var number = parameters.Get<string>("@NextNumber");
        //    var msg = parameters.Get<string>("@WorkFlowResponse");
        //    if (msg == "Duplicate")
        //    {
        //        msg = "Approver Number Already Exists Available Next Number is " + number;
        //    }
        //    else
        //    {
        //        msg = "Success";
        //    }
        //    return msg;
        //    //return id;
        //}
        public IList<LBS_SYS_WorkFlowApprover> GetAllWorkflowApprovers()
        {
           
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var workflowApprovers = con.Query<LBS_SYS_WorkFlowApprover>("SYS_WorkFlowApproversManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return workflowApprovers;
        }

        public LBS_SYS_WorkFlowApprover GetWorkflowApproversByID(Guid ID)
        {
            
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var workflowApprovers = con.Query<LBS_SYS_WorkFlowApprover>("SYS_WorkFlowApproversManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return workflowApprovers;
        }
        public IList<LBS_SYS_WorkFlowApprover> GetWorkflowApproversByWorkflowID(Guid ID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", ActionsForSP.SelectBYRecID.GetDescription());
            parameters.Add("@RecID", ID);
            var workflowApprovers = con.Query<LBS_SYS_WorkFlowApprover>("SYS_WorkFlowApproversManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return workflowApprovers;
        }
        public IList<LBS_SYS_WorkFlowApprover> GetLoginUsersforworkflowApprovers(Guid ID,string LoginID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@LoginID", LoginID);
            parameters.Add("@Action", ActionsForSP.SelectForDrpwn.GetDescription());

            var workflowApprovers = con.Query<LBS_SYS_WorkFlowApprover>("SYS_WorkFlowApproversManagement",
                                        param: parameters,
                                    commandType: CommandType.StoredProcedure).AsList();
            return workflowApprovers;
        }
    }
    
}
