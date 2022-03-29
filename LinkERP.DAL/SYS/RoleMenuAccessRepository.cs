using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class RoleMenuAccessRepository : BaseRepository, IRoleMenuAccessRepository
    {
        public IList<LBS_SYS_RoleMenuAccess> GetRoleMenuAccessByRoleAndModule(Guid RoleID, string ModuleID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RoleID", RoleID);
            parameters.Add("@ModuleID", ModuleID);
            var menus = con.Query<LBS_SYS_RoleMenuAccess, LBS_SYS_Menu, LBS_SYS_RoleMenuAccess>("SYS_GetRoleMenuAccessByRoleAndModule",
                map: (rma, m) =>
                {
                    rma.LBS_SYS_Menu = m;
                    return rma;
                },
                splitOn: "MenuID",
                param: parameters,
                commandType: CommandType.StoredProcedure).AsList();
            return menus;
        }
        public IList<LBS_SYS_RoleMenuAccess> GetRoleMenuAccessByRole(Guid RoleID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RoleID", RoleID);
            var menus = con.Query<LBS_SYS_RoleMenuAccess, LBS_SYS_Menu, LBS_SYS_RoleMenuAccess>("SYS_GetRoleMenuAccessByRole",
                map: (rma, m) =>
                {
                    rma.LBS_SYS_Menu = m;
                    return rma;
                },
                splitOn: "MenuID",
                param: parameters,
                commandType: CommandType.StoredProcedure).AsList();
            return menus;
        }

        public int AddUpdateRoleMenuAccess(IList<LBS_SYS_RoleMenuAccess> lstLBS_SYS_RoleMenuAccess)
        {
            foreach (LBS_SYS_RoleMenuAccess lBS_SYS_RoleMenuAccess in lstLBS_SYS_RoleMenuAccess)
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@ID", lBS_SYS_RoleMenuAccess.ID);
                parameters.Add("@RoleID", lBS_SYS_RoleMenuAccess.RoleID);
                parameters.Add("@MenuID", lBS_SYS_RoleMenuAccess.MenuID);
                parameters.Add("@ReadAccess", lBS_SYS_RoleMenuAccess.ReadAccess);
                parameters.Add("@WriteAccess", lBS_SYS_RoleMenuAccess.WriteAccess);
                parameters.Add("@DeleteAccess", lBS_SYS_RoleMenuAccess.DeleteAccess);
                parameters.Add("@AllAccess", lBS_SYS_RoleMenuAccess.AllAccess);
                parameters.Add("@NoAccess", lBS_SYS_RoleMenuAccess.NoAccess);
                parameters.Add("@CreatedBY", lBS_SYS_RoleMenuAccess.CreatedBY);

                SqlMapper.Query(con, "SYS_RoleMenuAccessManagement",
                    param: parameters,
                    commandType: CommandType.StoredProcedure);
            }
            return 1;
        }
    }
}
