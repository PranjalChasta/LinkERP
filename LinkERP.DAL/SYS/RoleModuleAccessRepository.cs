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
    public class RoleModuleAccessRepository : BaseRepository, IRoleModuleAccessRepository
    {
        public IList<LBS_SYS_RoleModuleAccess> GetRoleModuleAccess()
        {
            List<LBS_SYS_RoleModuleAccess> lBS_SYS_Companies = new List<LBS_SYS_RoleModuleAccess>();
            var companies = con.Query<LBS_SYS_RoleModuleAccess>("SYS_GetAllRoleModuleAccess",
                            commandType: CommandType.StoredProcedure).AsList();
            return companies;
        }
        public LBS_SYS_RoleModuleAccess GetRoleModuleAccesssByID(Guid ID)
        {
            List<LBS_SYS_RoleModuleAccess> lBS_SYS_Companies = new List<LBS_SYS_RoleModuleAccess>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            var companies = con.Query<LBS_SYS_RoleModuleAccess>("SYS_DeleteRoleModuleAccessByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return companies;
        }
        public string AddRoleModuleAccess(IList<LBS_SYS_RoleModuleAccess> lstLBS_SYS_RoleModuleAccess)
        {
            var id = "";
            foreach (LBS_SYS_RoleModuleAccess lBS_SYS_RoleModuleAccess in lstLBS_SYS_RoleModuleAccess)
            {
                DynamicParameters parameters = new DynamicParameters();

                //parameters.Add("@ID", lBS_SYS_Company.ID);

                parameters.Add("@RoleId", lBS_SYS_RoleModuleAccess.RoleId);
                parameters.Add("@ModuleID", lBS_SYS_RoleModuleAccess.ModuleID);
                parameters.Add("@Action", "AddRoleModuleAccess");
                parameters.Add("@RoleModuleResponseID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);


                SqlMapper.Query(con, "SYS_RoleModuleAccessManagement",
                                param: parameters,
                                commandType: CommandType.StoredProcedure);
                id += parameters.Get<string>("@RoleModuleResponseID") + ",";
            }
            return id;
        }
        public string UpdateRoleModuleAccess(LBS_SYS_RoleModuleAccess lBS_SYS_RoleModuleAccess)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", lBS_SYS_RoleModuleAccess.ID);
            parameters.Add("@RoleId", lBS_SYS_RoleModuleAccess.RoleId);
            parameters.Add("@ModuleID", lBS_SYS_RoleModuleAccess.ModuleID);
            parameters.Add("@RoleModuleResponseID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_RoleModuleAccessManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@RoleModuleResponseID");
            return id;
        }
        public bool DeleteRoleModuleAccessByID(Guid ID, string DeletedBy)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", ID);
            parameters.Add("@DeletedBy", DeletedBy);

            SqlMapper.Query(con, "SYS_DeleteRoleModuleAccessByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);

            return true;
        }
        public LBS_SYS_RoleModuleAccess GetRoleModuleAccessByRoleID(Guid RoleID)
        {
            List<LBS_SYS_RoleModuleAccess> lBS_SYS_Companies = new List<LBS_SYS_RoleModuleAccess>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RoleID", RoleID);
            var companies = con.Query<LBS_SYS_RoleModuleAccess>("SYS_GetRoleModuleAccessByRoleID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return companies;
        }

        public IList<LBS_SYS_Module> GetModulesExistsInRoleModuleAccess(Guid RoleID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RoleID", RoleID);
            parameters.Add("@Flag", "ModulesExistsInRoleModuleAccess");

            var roleModuleAccess = con.Query<LBS_SYS_Module>("SYS_GetRoleAccessByRoleID", 
                                        param: parameters,
                                    commandType: CommandType.StoredProcedure).AsList();
            return roleModuleAccess;
        }
        public IList<LBS_SYS_Module> GetModulesNotExistsInRoleModuleAccess(Guid RoleID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RoleID", RoleID);
            parameters.Add("@Flag", "ModulesNotExistsInRoleModuleAccess");

            var roleModuleAccess = con.Query<LBS_SYS_Module>("SYS_GetRoleAccessByRoleID",
                                        param: parameters,
                                    commandType: CommandType.StoredProcedure).AsList();
            return roleModuleAccess;
        }
       
        public bool DeleteRoleModuleAccess(Guid RoleID, string ModuleID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RoleID", RoleID);
            parameters.Add("@ModuleID", ModuleID);
            parameters.Add("@Action", "DeleteRoleModuleAccess");

            SqlMapper.Query(con, "SYS_RoleModuleAccessManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            return true;
        }
    }
}
