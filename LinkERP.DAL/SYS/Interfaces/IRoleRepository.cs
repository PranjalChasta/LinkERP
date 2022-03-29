using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface IRoleRepository
    {
        string AddRole(LBS_SYS_Role lBS_SYS_Role);
        string UpdateRole(LBS_SYS_Role lBS_SYS_Role);
        IList<LBS_SYS_Role> GetAllRoles();
        LBS_SYS_Role GetRoleByID(Guid ID);
        bool DeleteRoleByID(Guid ID, string DeletedBy);
    }
}
