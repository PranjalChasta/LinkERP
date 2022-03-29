using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class RoleService : IRoleService
    {
        IRoleRepository role;
        public RoleService(IRoleRepository _role)
        {
            role = _role;
        }
        public string AddRole(LBS_SYS_Role lBS_SYS_Role)
        {
            return role.AddRole(lBS_SYS_Role);
        }

        public bool DeleteRoleByID(Guid ID, string DeletedBy)
        {
            return role.DeleteRoleByID(ID, DeletedBy);
        }

        public IList<LBS_SYS_Role> GetAllRoles()
        {
            return role.GetAllRoles();
        }

        public LBS_SYS_Role GetRoleByID(Guid ID)
        {
            return role.GetRoleByID(ID);
        }

        public string UpdateRole(LBS_SYS_Role lBS_SYS_Role)
        {
            return role.UpdateRole(lBS_SYS_Role);
        }
    }
}
