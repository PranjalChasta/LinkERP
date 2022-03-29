using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface IPayTeamRepository
    {
        IList<LBS_SYS_RoleCompanyPayTeamAccess> GetPayTeamData(Guid CompanyID);
        string AddPayTeam(LBS_SYS_RoleCompanyPayTeamAccess lBS_SYS_RoleCompanyPayTeamAccess);
        string UpdatePayTeam(LBS_SYS_RoleCompanyPayTeamAccess lBS_SYS_RoleCompanyPayTeamAccess);
        

    }
}
