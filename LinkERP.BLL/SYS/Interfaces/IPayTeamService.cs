using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS.Interfaces
{
    public interface IPayTeamService
    {
        IList<LBS_SYS_RoleCompanyPayTeamAccess> GetPayTeamData(Guid CompanyID); 
        string AddPayTeam(LBS_SYS_RoleCompanyPayTeamAccess lBS_SYS_RolePayTeamAccess);
        string UpdatePayTeam(LBS_SYS_RoleCompanyPayTeamAccess lBS_SYS_RolePayTeamAccess);
        
    }
}
