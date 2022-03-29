using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.DTO.SYS.Role.RoleCompanyAccess;
using LinkERP.Entity.INV;
using LinkERP.Entity.PUR;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class RoleCompanyAccessRepository : BaseRepository, IRoleCompanyAccessRepository
    {
        public string AddRoleCompanyAccess(IList<LBS_SYS_RoleCompanyAccess> lstlBS_SYS_RoleCompanyAccess)
        {
            string id = "";
            foreach (LBS_SYS_RoleCompanyAccess lBS_SYS_RoleCompanyAccess in lstlBS_SYS_RoleCompanyAccess)
            {
                DynamicParameters parameters = new DynamicParameters();

                parameters.Add("@RoleID", lBS_SYS_RoleCompanyAccess.RoleID);
                parameters.Add("@CompanyID", lBS_SYS_RoleCompanyAccess.CompanyID);
                parameters.Add("@CreatedBY", lBS_SYS_RoleCompanyAccess.CreatedBY);
                parameters.Add("@Action", "AddRoleCompanyAccess");
                parameters.Add("@RoleCompanyAccessID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

                SqlMapper.Query(con, "SYS_RoleCompanyAccessManagement",
                                param: parameters,
                                commandType: CommandType.StoredProcedure);
                id += parameters.Get<string>("@RoleCompanyAccessID") + ",";
            }
            return id;
        }
        public string UpdateRoleCompanyAccess(LBS_SYS_RoleCompanyAccess lBS_SYS_RoleCompanyAccess)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", lBS_SYS_RoleCompanyAccess.ID);
            parameters.Add("@RoleID", lBS_SYS_RoleCompanyAccess.RoleID);
            parameters.Add("@CompanyID", lBS_SYS_RoleCompanyAccess.CompanyID);
            // parameters.Add("@CreatedBY", lBS_SYS_RoleCompanyAccess.CreatedBY);
            parameters.Add("@RoleCompanyAccessID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_RoleCompanyAccessManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@RoleCompanyAccessID");
            return id;
        }
        public bool DeleteRoleCompanyAccessByID(Guid ID, Guid DeletedBy)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", ID);
            parameters.Add("@DeletedBy", DeletedBy);

            SqlMapper.Query(con, "SYS_DeleteRoleCompanyAccess",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);

            return true;
        }
        public IList<LBS_SYS_RoleCompanyAccess> GetRoleCompanyAccesses()
        {
            List<LBS_SYS_RoleCompanyAccess> lBS_SYS_Companies = new List<LBS_SYS_RoleCompanyAccess>();
            var rolecompanyaccess = con.Query<LBS_SYS_RoleCompanyAccess>("SYS_GetAllRoleCompanyAccess",
                            commandType: CommandType.StoredProcedure).AsList();
            return rolecompanyaccess;
        }

        public IList<LBS_SYS_Company> GetCompaniesExistsInRoleCompanyAccess(Guid RoleID)
        {
            // List<LBS_SYS_RoleCompanyAccess> lBS_SYS_Companies = new List<LBS_SYS_RoleCompanyAccess>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RoleID", RoleID);
            parameters.Add("@Flag", "CompaniesExistsInRoleCompanyAccess");

            var rolecompanyaccess = con.Query<LBS_SYS_Company>("SYS_GetRoleAccessByRoleID", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return rolecompanyaccess;
        }
        public IList<SYS_RoleCompanyAccess> GetRoleCompanyAccessByRoleID(Guid RoleID)
        {
            // List<LBS_SYS_RoleCompanyAccess> lBS_SYS_Companies = new List<LBS_SYS_RoleCompanyAccess>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RoleID", RoleID);
            parameters.Add("@Flag", "RoleCompanyAccessByRoleID");

            var rolecompanyaccess = con.Query<SYS_RoleCompanyAccess>("SYS_GetRoleAccessByRoleID", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return rolecompanyaccess;
        }
        public bool DeleteRoleCompanyAccess(Guid AccessRoleId, Guid RoleID)
        {
            // List<LBS_SYS_RoleCompanyAccess> lBS_SYS_Companies = new List<LBS_SYS_RoleCompanyAccess>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@AccessRoleId", AccessRoleId);
            parameters.Add("@RoleID", RoleID);
            parameters.Add("@Action", "DeleteRoleCompanyAccess");
           var ok= SqlMapper.Query(con, "SYS_RoleCompanyAccessManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            return true;
        }
        public IList<LBS_SYS_Company> GetCompaniesNotExistsInRoleCompanyAccess(Guid RoleID)
        {
            // List<LBS_SYS_RoleCompanyAccess> lBS_SYS_Companies = new List<LBS_SYS_RoleCompanyAccess>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RoleID", RoleID);
            parameters.Add("@Flag", "CompaniesNotExistsInRoleCompanyAccess");

            var rolecompanyaccess = con.Query<LBS_SYS_Company>("SYS_GetRoleAccessByRoleID", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return rolecompanyaccess;
        }
        public IList<LBS_SYS_RoleCompanyWarehouseAccess> GetWareHousesNotExistsInRoleWarehouseyAccess(Guid RoleID, Guid CompanyID)
        {
            // List<LBS_SYS_RoleCompanyAccess> lBS_SYS_Companies = new List<LBS_SYS_RoleCompanyAccess>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RoleID", RoleID);
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", "WareHouseNotExistsInRoleWarehouseAccess");

            var warehouse = con.Query<LBS_SYS_RoleCompanyWarehouseAccess>("SYS_GetWareHouseAccess", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return warehouse;
        }
        public IList<LBS_SYS_RoleCompanyWarehouseAccess> GetWareHousesExistsInRoleWarehouseyAccess(Guid RoleID, Guid CompanyID)
        {
            // List<LBS_SYS_RoleCompanyAccess> lBS_SYS_Companies = new List<LBS_SYS_RoleCompanyAccess>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RoleID", RoleID);
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", "WareHouseExistsInRoleWarehouseAccess");

            var warehouse = con.Query<LBS_SYS_RoleCompanyWarehouseAccess>("SYS_GetWareHouseAccess", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return warehouse;
        }
        public IList<LBS_INV_Warehouse> GetWareHouses(Guid CompanyID)
        {
            // List<LBS_SYS_RoleCompanyAccess> lBS_SYS_Companies = new List<LBS_SYS_RoleCompanyAccess>();
            DynamicParameters parameters = new DynamicParameters();
           
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", "AllWareHouse");

            var allwarehouse = con.Query<LBS_INV_Warehouse>("SYS_GetWareHouseAccess", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return allwarehouse;
        }
        public string AddRoleWarehouseAccess(IList<LBS_SYS_RoleCompanyWarehouseAccess> LBS_SYS_RoleCompanyWarehouseAccess)
        {
            string id = "";
            foreach (LBS_SYS_RoleCompanyWarehouseAccess LBS_SYS_RoleCompanyWarehouse in LBS_SYS_RoleCompanyWarehouseAccess)
            {
                DynamicParameters parameters = new DynamicParameters();

                parameters.Add("@RoleID", LBS_SYS_RoleCompanyWarehouse.RoleID);
                parameters.Add("@WarehouseID", LBS_SYS_RoleCompanyWarehouse.ID);
                parameters.Add("@CompanyID", LBS_SYS_RoleCompanyWarehouse.CompanyID);
                parameters.Add("@CreatedBY", LBS_SYS_RoleCompanyWarehouse.CreatedBY);
                parameters.Add("@Action", "AddRoleWareHouseAccess");
                parameters.Add("@ResponseID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

                SqlMapper.Query(con, "SYS_GetWareHouseAccess",
                                param: parameters,
                                commandType: CommandType.StoredProcedure);
                id += parameters.Get<string>("@ResponseID") + ",";
            }
            return id;
        }
        public bool DeleteRoleWarehouseAccessByID(Guid RoleID, Guid WarehouseID, Guid CompanyID)
        {
 
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RoleID", RoleID);
            parameters.Add("@WarehouseID", WarehouseID);
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", "DeleteRoeWarehouseAccess");
            var ok = SqlMapper.Query(con, "SYS_GetWareHouseAccess",
                             param: parameters,
                             commandType: CommandType.StoredProcedure);
            return true;
        }
    }
}
