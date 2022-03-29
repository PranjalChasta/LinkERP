using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class RoleRepository : BaseRepository, IRoleRepository
    {
        public IList<LBS_SYS_Role> GetAllRoles()
        {
            var roles = con.Query<LBS_SYS_Role>("SYS_GetAllRoles",
                            commandType: CommandType.StoredProcedure).AsList();
            return roles;
        }
        public LBS_SYS_Role GetRoleByID(Guid ID)
        {          
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            var roles = con.Query<LBS_SYS_Role>("SYS_GetRoleByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return roles;
        }
        public string AddRole(LBS_SYS_Role lBS_SYS_Role)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RoleCode", lBS_SYS_Role.RoleCode);
            parameters.Add("@RoleName", lBS_SYS_Role.RoleName);
            parameters.Add("@CreatedBY", lBS_SYS_Role.CreatedBY);
            parameters.Add("@RoleID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_RoleManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@RoleID");
            return id;
        }
        public string UpdateRole(LBS_SYS_Role lBS_SYS_Role)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", lBS_SYS_Role.ID);
            parameters.Add("@RoleCode", lBS_SYS_Role.RoleCode);
            parameters.Add("@RoleName", lBS_SYS_Role.RoleName);
            parameters.Add("@CreatedBY", lBS_SYS_Role.CreatedBY);
            parameters.Add("@RoleID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
            SqlMapper.Query(con, "SYS_RoleManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@RoleID");
            return id;
        }
        public bool DeleteRoleByID(Guid ID, string DeletedBy)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", ID);
            parameters.Add("@DeletedBy", DeletedBy);

            SqlMapper.Query(con, "SYS_DeleteRoleByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);

            return true;
        }
        public IList<LBS_SYS_Role> GetRoles()
        {            
            var roles = con.Query<LBS_SYS_Role>("SYS_GetRoles",
                            commandType: CommandType.StoredProcedure).AsList();
            return roles;
        }
    }
}
