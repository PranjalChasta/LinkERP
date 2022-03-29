using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SYS
{
  public  class JobRepository : BaseRepository, IJobRepository
    {
        public IList<LBS_SYS_Jobs> GetJobs(Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var companies = con.Query<LBS_SYS_Jobs>("[SYS_JobManageement]", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return companies;
        }
        public LBS_SYS_Jobs GetJobByID(Guid ID)
        {
            List<LBS_SYS_Jobs> lBS_SYS_Jobs = new List<LBS_SYS_Jobs>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var companies = con.Query<LBS_SYS_Jobs>("[SYS_JobManageement]",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return companies;
        }
        public string AddJob(LBS_SYS_Jobs lBS_SYS_Jobs)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", lBS_SYS_Jobs.CompanyID);
            parameters.Add("@JobCode", lBS_SYS_Jobs.JobCode);
            parameters.Add("@JobName", lBS_SYS_Jobs.JobName);
            parameters.Add("@JobScript", lBS_SYS_Jobs.JobScript);
            parameters.Add("@EmailAddress", lBS_SYS_Jobs.EmailAddress);
            parameters.Add("@CopyEmailAddress", lBS_SYS_Jobs.CopyEmailAddress);
            parameters.Add("@BCCEmailAddress", lBS_SYS_Jobs.BCCEmailAddress);
            parameters.Add("@LastExecuteDateTime", lBS_SYS_Jobs.LastExecuteDateTime);
            parameters.Add("@NextExecuteDateTime", lBS_SYS_Jobs.NextExecuteDateTime);
            parameters.Add("@DocumentTemplateID", lBS_SYS_Jobs.DocumentTemplateID);
            parameters.Add("@ModuleID", lBS_SYS_Jobs.ModuleID);
            parameters.Add("@FrequencyID", lBS_SYS_Jobs.FrequencyID);
            parameters.Add("@Status", lBS_SYS_Jobs.Status);
            parameters.Add("@CreatedBY", lBS_SYS_Jobs.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Add.GetDescription());
            parameters.Add("@jobID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "[SYS_JobManageement]",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@jobID");
            return id;
        }
        public string UpdateJob(LBS_SYS_Jobs lBS_SYS_Jobs)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", lBS_SYS_Jobs.ID);
            parameters.Add("@CompanyID", lBS_SYS_Jobs.CompanyID);
            parameters.Add("@JobCode", lBS_SYS_Jobs.JobCode);
            parameters.Add("@JobName", lBS_SYS_Jobs.JobName);
            parameters.Add("@JobScript", lBS_SYS_Jobs.JobScript);
            parameters.Add("@EmailAddress", lBS_SYS_Jobs.EmailAddress);
            parameters.Add("@CopyEmailAddress", lBS_SYS_Jobs.CopyEmailAddress);
            parameters.Add("@BCCEmailAddress", lBS_SYS_Jobs.BCCEmailAddress);
            parameters.Add("@LastExecuteDateTime", lBS_SYS_Jobs.LastExecuteDateTime);
            parameters.Add("@NextExecuteDateTime", lBS_SYS_Jobs.NextExecuteDateTime);
            parameters.Add("@DocumentTemplateID", lBS_SYS_Jobs.DocumentTemplateID);
            parameters.Add("@ModuleID", lBS_SYS_Jobs.ModuleID);
            parameters.Add("@FrequencyID", lBS_SYS_Jobs.FrequencyID);
            parameters.Add("@Status", lBS_SYS_Jobs.Status);
            // parameters.Add("@CreatedBY", lBS_SYS_Jobs.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Edit.GetDescription());
            parameters.Add("@jobID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "[SYS_JobManageement]",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@jobID");
            return id;
        }
        public bool DeleteJobByID(Guid ID, string DeletedBy)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", ID);
            parameters.Add("@DeletedBy", DeletedBy);

            SqlMapper.Query(con, "SYS_DeleteJobByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);

            return true;
        }
    }
}
