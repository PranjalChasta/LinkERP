using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class RoleMenuAccessService : IRoleMenuAccessService
    {
        IRoleMenuAccessRepository roleMenuAccessRepository;
        public RoleMenuAccessService(IRoleMenuAccessRepository _roleMenuAccessRepository)
        {
            roleMenuAccessRepository = _roleMenuAccessRepository;
        }
        public int AddUpdateRoleMenuAccess(IList<LBS_SYS_RoleMenuAccess> lstLBS_SYS_RoleMenuAccess)
        {
            return roleMenuAccessRepository.AddUpdateRoleMenuAccess(lstLBS_SYS_RoleMenuAccess);
        }
        public IList<LBS_SYS_RoleMenuAccess> GetRoleMenuAccessByRole(Guid RoleID)
        {
            return roleMenuAccessRepository.GetRoleMenuAccessByRole(RoleID);
        }
        public IList<LBS_SYS_RoleMenuAccess> GetRoleMenuAccessByRoleAndModule(Guid RoleID, string ModuleID)
        {
            return roleMenuAccessRepository.GetRoleMenuAccessByRoleAndModule(RoleID, ModuleID);
        }
    }
}
