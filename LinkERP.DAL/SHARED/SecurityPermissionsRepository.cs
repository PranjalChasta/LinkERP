using Dapper;
using LinkERP.DAL.SHARED.Interfaces;
using LinkERP.Entity.PUR;
using LinkERP.Entity.SHARED;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace LinkERP.DAL.SHARED
{
    public class SecurityPermissionsRepository : BaseRepository, ISecurityPermissionsRepository
    {
        public IList<MenuPermissions> GetMenuPermissions(string LoginID, Guid CompanyID)
        {
             
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@LoginID", LoginID);
            parameters.Add("@CompanyID", CompanyID);
            var Menus = con.Query<MenuPermissions>("SYS_GetMenuPermissions", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return Menus;
        }

        public IList<ModulePermissions> GetModulePermissions(string LoginID, Guid CompanyID)
        {   
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@LoginID", LoginID);
            parameters.Add("@CompanyID", CompanyID);
            var Module = con.Query<ModulePermissions>("SYS_GetModulePermissions", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return Module;
        }

        public IList<CompaniesPermissions> GetCompaniesPermissions(string LoginID)
        {
            DynamicParameters parameters = new DynamicParameters(); 
            parameters.Add("@LoginID", LoginID); 
            var Companies = con.Query<CompaniesPermissions>("SYS_GetCompaniesPermissions", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return Companies;
        }
        public IList<WarehousesPermissions> GetWarehousesPermissions(string LoginID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@LoginID", LoginID);
            var Warehouses = con.Query<WarehousesPermissions>("SYS_GetWarehousesPermissions", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return Warehouses;
        }
    }
}
