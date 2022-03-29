using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
   public  class RoleModuleAccessService: IRoleModuleAccessService
    {
        IRoleModuleAccessRepository roleModuleAccess;
        public RoleModuleAccessService(IRoleModuleAccessRepository _roleaccess)
        {
            roleModuleAccess = _roleaccess;
        }

        public string AddRoleModuleAccess(IList<LBS_SYS_RoleModuleAccess> lstLBS_SYS_RoleModuleAccess)
        {
            return roleModuleAccess.AddRoleModuleAccess(lstLBS_SYS_RoleModuleAccess);
        }

        public bool DeleteRoleModuleAccessByID(Guid ID, string DeletedBy)
        {
            return roleModuleAccess.DeleteRoleModuleAccessByID(ID, DeletedBy);
        }
        public IList<LBS_SYS_RoleModuleAccess> GetRoleModuleAccess()
        {
            return roleModuleAccess.GetRoleModuleAccess();
        }
        public LBS_SYS_RoleModuleAccess GetRoleModuleAccesssByID(Guid ID)
        {
            return roleModuleAccess.GetRoleModuleAccesssByID(ID);
        }
        public string UpdateRoleModuleAccess(LBS_SYS_RoleModuleAccess lBS_SYS_RoleModuleAccess)
        {
            return roleModuleAccess.UpdateRoleModuleAccess(lBS_SYS_RoleModuleAccess);
        }
        public LBS_SYS_RoleModuleAccess GetRoleModuleAccessByRoleID(Guid RoleID)
        {
            return roleModuleAccess.GetRoleModuleAccessByRoleID(RoleID);
        }

        public IList<LBS_SYS_Module> GetModulesExistsInRoleModuleAccess(Guid RoleID)
        {
            return roleModuleAccess.GetModulesExistsInRoleModuleAccess(RoleID);
        }
        public IList<LBS_SYS_Module> GetModulesNotExistsInRoleModuleAccess(Guid RoleID)
        {
            return roleModuleAccess.GetModulesNotExistsInRoleModuleAccess(RoleID);
        }
       
        public bool DeleteRoleModuleAccess(Guid RoleID, string ModuleID)
        {
            return roleModuleAccess.DeleteRoleModuleAccess(RoleID, ModuleID);
        }
    }
}
