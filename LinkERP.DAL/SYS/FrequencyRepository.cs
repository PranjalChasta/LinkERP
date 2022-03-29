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
    public class FrequencyRepository : BaseRepository, IFrequencyRepository
    {
        public IList<LBS_SYS_Frequency> GetFrequency(Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();
            //parameters.Add("@flag", 1);
            parameters.Add("@ID", null);
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var frequency = con.Query<LBS_SYS_Frequency>("SYS_FrequencyManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return frequency;
        }

        public string AddFrequency(LBS_SYS_Frequency lBS_SYS_frequency)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", lBS_SYS_frequency.CompanyID);
            parameters.Add("@FrequencyName", lBS_SYS_frequency.FrequencyName);
            parameters.Add("@FrequencyType", lBS_SYS_frequency.FrequencyType);
            parameters.Add("@Frequency", lBS_SYS_frequency.Frequency);
            parameters.Add("@DateTimeStart", lBS_SYS_frequency.DateTimeStart);
            parameters.Add("@CreatedBY", lBS_SYS_frequency.CreatedBY);
            parameters.Add("@DateTimeEnd", lBS_SYS_frequency.DateTimeEnd);
            parameters.Add("@Action", ActionsForSP.Add.GetDescription());
            parameters.Add("@FrequencyID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_FrequencyManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@FrequencyID");
            return id;
        }

        public string UpdateFrequency(LBS_SYS_Frequency lBS_SYS_frequency)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", lBS_SYS_frequency.ID);
            parameters.Add("@CompanyID", lBS_SYS_frequency.CompanyID);
            parameters.Add("@FrequencyName", lBS_SYS_frequency.FrequencyName);
            parameters.Add("@FrequencyType", lBS_SYS_frequency.FrequencyType);
            parameters.Add("@Frequency", lBS_SYS_frequency.Frequency);
            parameters.Add("@DateTimeStart", lBS_SYS_frequency.DateTimeStart);
            parameters.Add("@DateTimeEnd", lBS_SYS_frequency.DateTimeEnd);
            parameters.Add("@Action", ActionsForSP.Edit.GetDescription());
            parameters.Add("@FrequencyID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
            SqlMapper.Query(con, "SYS_FrequencyManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@FrequencyID");
            return id;
        }

        public bool DeleteFrequencyByID(Guid ID, string DeletedBy)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", ID);
            parameters.Add("@DeletedBy", DeletedBy);

            SqlMapper.Query(con, "SYS_DeleteFrequencyByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);

            return true;
        }

        public LBS_SYS_Frequency GetFrequencyByID(Guid ID)
        {
            List<LBS_SYS_Frequency> lBS_SYS_Companies = new List<LBS_SYS_Frequency>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            //parameters.Add("@flag", 2);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var Frequencydetails = con.Query<LBS_SYS_Frequency>("SYS_FrequencyManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return Frequencydetails;
        }

        public IList<LBS_SYS_Frequency> GetFrequencyByCompanyID(Guid CompanyID)
        {
           
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@CompanyID", CompanyID);
            var frequency = con.Query<LBS_SYS_Frequency>("SYS_GetFrequencyByCompanyID", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return frequency;
        }
    }
}
