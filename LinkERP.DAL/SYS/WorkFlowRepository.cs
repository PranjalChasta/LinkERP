using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class WorkFlowRepository :BaseRepository,IWorkFlowRepository
    {
        public string AddWorkFlow(LBS_SYS_WorkFlow lBS_SYS_WorkFlow)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", lBS_SYS_WorkFlow.CompanyID);
            parameters.Add("@WorkFlowCode", lBS_SYS_WorkFlow.WorkFlowCode);
            parameters.Add("@WorkFlowName", lBS_SYS_WorkFlow.WorkFlowName);
            parameters.Add("@CreatedBY", lBS_SYS_WorkFlow.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Add.GetDescription());
            parameters.Add("@WorkFlowID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_WorkFlowManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@WorkFlowID");
            return id;
        }
        public string UpdateWorkFlow(LBS_SYS_WorkFlow lBS_SYS_WorkFlow)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("ID", lBS_SYS_WorkFlow.ID);
            parameters.Add("@WorkFlowCode", lBS_SYS_WorkFlow.WorkFlowCode);
            parameters.Add("@WorkFlowName", lBS_SYS_WorkFlow.WorkFlowName);
            parameters.Add("@CreatedBY", lBS_SYS_WorkFlow.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Edit.GetDescription());
            parameters.Add("@WorkFlowID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
            SqlMapper.Query(con, "SYS_WorkFlowManagement",
                           param: parameters,
                           commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@WorkFlowID");
            return id;
        }
        public IList<LBS_SYS_WorkFlow> GetAllWorkFlows(Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var workFlow = con.Query<LBS_SYS_WorkFlow>("SYS_WorkFlowManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return workFlow;
        }
        public LBS_SYS_WorkFlow GetWorkFlowByID(Guid ID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var workFlow = con.Query<LBS_SYS_WorkFlow>("SYS_WorkFlowManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return workFlow;
        }
        public string AddUpdateWorkFlowData(string lBS_SYS_WorkFlow)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@WorkFlowDataJsonList", lBS_SYS_WorkFlow);
            parameters.Add("@Action", "EditList");
            parameters.Add("@UpdateMsg", dbType: DbType.String, size: 150, direction: ParameterDirection.Output);
            SqlMapper.Query(con, "SYS_WorkFlowManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var UpdateMsg = parameters.Get<string>("@UpdateMsg");
            return UpdateMsg;
        }
    }
}
