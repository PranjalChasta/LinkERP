using LinkERP.Entity.PUR;
using LinkERP.Entity.SHARED;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SHARED.Interfaces
{
    public interface ISecurityPermissionsRepository
    {
        IList<MenuPermissions> GetMenuPermissions(string LoginID, Guid CompanyID);

        IList<ModulePermissions> GetModulePermissions(string LoginID, Guid CompanyID);

        IList<CompaniesPermissions> GetCompaniesPermissions(string LoginID);
        IList<WarehousesPermissions> GetWarehousesPermissions(string LoginID);
    }
}
