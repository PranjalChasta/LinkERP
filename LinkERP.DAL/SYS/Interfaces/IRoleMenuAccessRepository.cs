using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface IRoleMenuAccessRepository
    {
        IList<LBS_SYS_RoleMenuAccess> GetRoleMenuAccessByRoleAndModule(Guid RoleID, string ModuleID);
        IList<LBS_SYS_RoleMenuAccess> GetRoleMenuAccessByRole(Guid RoleID);
        int AddUpdateRoleMenuAccess(IList<LBS_SYS_RoleMenuAccess> lstLBS_SYS_RoleMenuAccess);
    }
}
