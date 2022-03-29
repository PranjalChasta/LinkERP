using LinkERP.DTO.SYS.Role.RoleCompanyAccess;
using LinkERP.Entity.INV;
using LinkERP.Entity.PUR;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS.Interfaces
{
    public interface IRoleCompanyAccessService
    {
        string AddRoleCompanyAccess(IList<LBS_SYS_RoleCompanyAccess> lBS_SYS_RoleCompanyAccess);
      
        string UpdateRoleCompanyAccess(LBS_SYS_RoleCompanyAccess lBS_SYS_RoleCompanyAccess);
        bool DeleteRoleCompanyAccessByID(Guid ID, Guid DeletedBy);
        IList<LBS_SYS_Company> GetCompaniesExistsInRoleCompanyAccess(Guid RoleID);
        IList<LBS_SYS_Company> GetCompaniesNotExistsInRoleCompanyAccess(Guid RoleID);
        IList<SYS_RoleCompanyAccess> GetRoleCompanyAccessByRoleID(Guid RoleID);
        bool DeleteRoleCompanyAccess(Guid AccessRoleId, Guid RoleID);
        //warehouse
        IList<LBS_SYS_RoleCompanyWarehouseAccess> GetWareHousesNotExistsInRoleWarehouseyAccess(Guid RoleID, Guid CompanyID);
        IList<LBS_SYS_RoleCompanyWarehouseAccess> GetWareHousesExistsInRoleWarehouseyAccess(Guid RoleID, Guid CompanyID);
        IList<LBS_INV_Warehouse> GetWareHouses(Guid CompanyID);
        string AddRoleWarehouseAccess(IList<LBS_SYS_RoleCompanyWarehouseAccess> LBS_SYS_RoleCompanyWarehouseAccess);
        bool DeleteRoleWarehouseAccessByID(Guid RoleID, Guid WarehouseID, Guid CompanyID);
    }
}
