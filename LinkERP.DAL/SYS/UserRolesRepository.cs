using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class UserRolesRepository : BaseRepository, IUserRolesRepository
    {
        public IList<LBS_SYS_UserRoles> GetUserAllUserRoles()
        {
            string Query = @"";

            var userRoles = con.Query<LBS_SYS_UserRoles>(Query, commandType: CommandType.Text).AsList();
            return userRoles;
        }

        public void AddUserRole(LBS_SYS_UserRoles lBS_SYS_UserRoles)
        {
            DynamicParameters parameters = new DynamicParameters();
           // parameters.Add("@ID", Guid.NewGuid());
            parameters.Add("@LoginID", lBS_SYS_UserRoles.LoginID);
            parameters.Add("@RoleId", lBS_SYS_UserRoles.RoleId);
            parameters.Add("@CreatedBY", lBS_SYS_UserRoles.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Add.GetDescription());
            var UserRoles = con.Query<LBS_SYS_UserRoles>("SYS_UsersroleManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList(); 
            //string Query = @"INSERT INTO LBS_SYS_UserRoles
            //           (ID, LoginID, RoleId, CreatedBY, DateCreated)
            //           VALUES
            //           (@ID, @LoginID, @RoleId, @CreatedBY, GETDATE())";

            //SqlMapper.Query(con, Query,
            //                param: parameters,
            //                commandType: CommandType.Text);
        }

        public IList<LBS_SYS_UserRoles> GetUserRolesByID(string LoginID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            parameters.Add("@LoginID", LoginID);
            var UserRoles = con.Query<LBS_SYS_UserRoles>("SYS_UsersroleManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return UserRoles;
        }

        public IList<LBS_SYS_Role> GetRolesByID(string LoginID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", ActionsForSP.SelectBYRecID.GetDescription());
            parameters.Add("@LoginID", LoginID);
            var Roles = con.Query<LBS_SYS_Role>("SYS_UsersroleManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return Roles;
        }
        public IList<LBS_SYS_Role> GetRolesByCompanyID(string LoginID,Guid DefaultCompany)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", "SelectByCompany");
            parameters.Add("@LoginID", LoginID);
            parameters.Add("@DefaultCompany", DefaultCompany);
            var Roles = con.Query<LBS_SYS_Role>("SYS_UsersroleManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return Roles;
        }
    }
}
