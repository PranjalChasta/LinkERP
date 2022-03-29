using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
   public interface IRoleModuleAccessRepository
    {
        string AddRoleModuleAccess(IList<LBS_SYS_RoleModuleAccess> lstLBS_SYS_RoleModuleAccess);
        string UpdateRoleModuleAccess(LBS_SYS_RoleModuleAccess lBS_SYS_RoleModuleAccess);
        IList<LBS_SYS_RoleModuleAccess> GetRoleModuleAccess();
        LBS_SYS_RoleModuleAccess GetRoleModuleAccesssByID(Guid ID);
        bool DeleteRoleModuleAccessByID(Guid ID, string DeletedBy);
        LBS_SYS_RoleModuleAccess GetRoleModuleAccessByRoleID(Guid RoleID);
        IList<LBS_SYS_Module> GetModulesExistsInRoleModuleAccess(Guid RoleID);
        IList<LBS_SYS_Module> GetModulesNotExistsInRoleModuleAccess(Guid RoleID);
        bool DeleteRoleModuleAccess(Guid RoleID, string ModuleID);
    }
}
