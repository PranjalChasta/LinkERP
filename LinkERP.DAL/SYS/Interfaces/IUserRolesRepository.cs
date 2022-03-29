using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface IUserRolesRepository
    {
        void AddUserRole(LBS_SYS_UserRoles lBS_SYS_UserRoles);
        IList<LBS_SYS_UserRoles> GetUserRolesByID(string LoginID);
        IList<LBS_SYS_Role> GetRolesByID(string LoginID);
        IList<LBS_SYS_Role> GetRolesByCompanyID(string LoginID, Guid DefaultCompany);
    }
}
