using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class PayTeamRepository : BaseRepository,IPayTeamRepository
    {
        public IList<LBS_SYS_RoleCompanyPayTeamAccess> GetPayTeamData(Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyId",CompanyID);
            var payTeam = con.Query<LBS_SYS_RoleCompanyPayTeamAccess>("SYS_RoleCompanyPayTeamAccess", param: parameters,
            commandType: CommandType.StoredProcedure).AsList();
            return payTeam;
        }

        public string AddPayTeam(LBS_SYS_RoleCompanyPayTeamAccess lBS_SYS_RolePayTeamAccess)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@RoleID", lBS_SYS_RolePayTeamAccess.RoleID);
            parameters.Add("@CompanyID", lBS_SYS_RolePayTeamAccess.CompanyID);
            parameters.Add("@PayTeamId", lBS_SYS_RolePayTeamAccess.PayTeamId);
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());

            SqlMapper.Query(con, "SYS_RoleCompanyPayTeamAccess",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@ID");
            return id;
        }

        public string UpdatePayTeam(LBS_SYS_RoleCompanyPayTeamAccess lBS_SYS_RolePayTeamAccess)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", lBS_SYS_RolePayTeamAccess.ID);
            parameters.Add("@RoleID", lBS_SYS_RolePayTeamAccess.RoleID);
            parameters.Add("@CompanyID", lBS_SYS_RolePayTeamAccess.CompanyID);
            parameters.Add("@PayTeamId", lBS_SYS_RolePayTeamAccess.PayTeamId);
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());

            SqlMapper.Query(con, "SYS_RoleCompanyPayTeamAccess",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@ID");
            return id;
        }
    }
}
