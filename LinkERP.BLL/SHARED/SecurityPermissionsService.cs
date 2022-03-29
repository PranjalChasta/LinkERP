using LinkERP.BLL.SHARED.Interfaces;
using LinkERP.DAL.SHARED.Interfaces;
using LinkERP.Entity.PUR;
using LinkERP.Entity.SHARED;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SHARED
{
    public class SecurityPermissionsService : ISecurityPermissionsService
    {
        ISecurityPermissionsRepository securityPermissions;
        public SecurityPermissionsService(ISecurityPermissionsRepository _securityPermissions)
        {
            securityPermissions = _securityPermissions;
        }
        public IList<MenuPermissions> GetMenuPermissions(string LoginID, Guid CompanyID)
        {
            return securityPermissions.GetMenuPermissions(LoginID, CompanyID);
        }
        public IList<ModulePermissions> GetModulePermissions(string LoginID, Guid CompanyID)
        {
            return securityPermissions.GetModulePermissions(LoginID, CompanyID);
        }

        public IList<CompaniesPermissions> GetCompaniesPermissions(string LoginID)
        {
            return securityPermissions.GetCompaniesPermissions(LoginID);
        }

        public IList<WarehousesPermissions> GetWarehousesPermissions(string LoginID)
        {
            return securityPermissions.GetWarehousesPermissions(LoginID);
        }
    }
}
