using LinkERP.DAL.SYS.Interfaces;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;
using System.Collections;

namespace LinkERP.BLL.SYS
{
    public class PayTeamService : IPayTeamService
    {
        IPayTeamRepository payTeam;

        public PayTeamService(IPayTeamRepository _payTeam)
        {
            payTeam = _payTeam;
        }

 
        public IList<LBS_SYS_RoleCompanyPayTeamAccess> GetPayTeamData(Guid CompanyID)
        {
            return payTeam.GetPayTeamData(CompanyID);
        }
        public string AddPayTeam(LBS_SYS_RoleCompanyPayTeamAccess lBS_SYS_RolePayTeamAccess)
        {
            return payTeam.AddPayTeam(lBS_SYS_RolePayTeamAccess);
        }
        public string UpdatePayTeam(LBS_SYS_RoleCompanyPayTeamAccess lBS_SYS_RolePayTeamAccess)
        {
            return payTeam.UpdatePayTeam(lBS_SYS_RolePayTeamAccess);
        }
    }
}
