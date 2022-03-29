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
    public class ConfigurationRepository : BaseRepository, IConfigurationRepository
    {
        public string AddConfiguration(LBS_SYS_Configuration lBS_SYS_Configuration)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", lBS_SYS_Configuration.CompanyID);
            parameters.Add("@Flag", lBS_SYS_Configuration.Flag);
            parameters.Add("@FlagName", lBS_SYS_Configuration.FlagName);
            parameters.Add("@Value", lBS_SYS_Configuration.Value);
            parameters.Add("@ModuleId", lBS_SYS_Configuration.ModuleId);
            parameters.Add("@Action", ActionsForSP.Add.GetDescription());
            parameters.Add("@ConfiguartionID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_ConfigurationManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@ConfiguartionID");
            return id;
        }
        public string UpdateConfiguration(LBS_SYS_Configuration lBS_SYS_Configuration)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", lBS_SYS_Configuration.ID);
            parameters.Add("@CompanyID", lBS_SYS_Configuration.CompanyID);
            parameters.Add("@Flag", lBS_SYS_Configuration.Flag);
            parameters.Add("@FlagName", lBS_SYS_Configuration.FlagName);
            parameters.Add("@Value", lBS_SYS_Configuration.Value);
            parameters.Add("@ModuleId", lBS_SYS_Configuration.ModuleId);
            parameters.Add("@Action", ActionsForSP.Edit.GetDescription());
            parameters.Add("@ConfiguartionID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_ConfigurationManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@ConfiguartionID");
            return id;
        }
        public IList<LBS_SYS_Configuration> GetAllConfigurations(Guid CompanyID)
        {
            List<LBS_SYS_Configuration> lBS_SYS_taxcode = new List<LBS_SYS_Configuration>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var configurations = con.Query<LBS_SYS_Configuration>("SYS_ConfigurationManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return configurations;
        }

        public LBS_SYS_Configuration GetConfigurationByID(Guid ID)
        {
            List<LBS_SYS_Configuration> lBS_SYS_taxcode = new List<LBS_SYS_Configuration>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var configurations = con.Query<LBS_SYS_Configuration>("SYS_ConfigurationManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return configurations;
        }
        public IList<LBS_SYS_Configuration> GetAllConfigurationByIDs(Guid CompanyID, string ModuleId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@ModuleId", ModuleId);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var configurations = con.Query<LBS_SYS_Configuration>("SYS_ConfigurationManagement",
                param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return configurations;
        }

        public string UpdateConfigurationData(string lBS_SYS_Configuration)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@UpdateDataJsonList", lBS_SYS_Configuration);
            parameters.Add("@Action", "EditList");
            parameters.Add("@UpdateMsg", dbType: DbType.String, size: 150, direction: ParameterDirection.Output);
            SqlMapper.Query(con, "SYS_ConfigurationManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var UpdateMsg = parameters.Get<string>("@UpdateMsg");
            return UpdateMsg;
        }

        public LBS_SYS_Configuration GetConfigurationByFlag(Guid CompanyID, string Flag)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Flag", Flag);
            parameters.Add("@Action", "SelectByFlagAndCompany");
            var configuration = con.Query<LBS_SYS_Configuration>("SYS_ConfigurationManagement",
                param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return configuration;
        }
        public IList<LBS_SYS_Configuration> GetDefaultConfiguration(Guid CompanyID, string ModuleId)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@ModuleId", ModuleId);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var configurations = con.Query<LBS_SYS_Configuration>("SYS_ConfigurationManagement",
                param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return configurations;
        }
    }
}
