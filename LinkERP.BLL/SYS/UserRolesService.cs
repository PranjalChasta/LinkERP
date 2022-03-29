using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class UserRolesService : IUserRolesService
    {
        IUserRolesRepository userRolesRepository;
        public UserRolesService(IUserRolesRepository _userRolesRepository)
        {
            userRolesRepository = _userRolesRepository;
        }
        public void AddUserRole(LBS_SYS_UserRoles lBS_SYS_UserRoles)
        {
            userRolesRepository.AddUserRole(lBS_SYS_UserRoles);
        } 

        public IList<LBS_SYS_UserRoles> GetUserRolesByID(string LoginID)
        {
            return userRolesRepository.GetUserRolesByID(LoginID);
        }

        public IList<LBS_SYS_Role> GetRolesByID(string LoginID)
        {
            return userRolesRepository.GetRolesByID(LoginID);
        }
        public IList<LBS_SYS_Role> GetRolesByCompanyID(string LoginID,Guid DefaultCompany)
        {
            return userRolesRepository.GetRolesByCompanyID(LoginID, DefaultCompany);
        }

    }
}
