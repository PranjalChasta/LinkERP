using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.DTO.SYS.Role.RoleCompanyAccess;
using LinkERP.Entity.INV;
using LinkERP.Entity.PUR;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
  public class RoleCompanyAccessService : IRoleCompanyAccessService
    {
        IRoleCompanyAccessRepository rolecompanyaccess;
        public RoleCompanyAccessService(IRoleCompanyAccessRepository _rolecompanyaccess)
        {
            rolecompanyaccess = _rolecompanyaccess;
        }
        public string AddRoleCompanyAccess(IList<LBS_SYS_RoleCompanyAccess> lBS_SYS_RoleCompanyAccess)
        {
            return rolecompanyaccess.AddRoleCompanyAccess(lBS_SYS_RoleCompanyAccess);
        }
        public string UpdateRoleCompanyAccess(LBS_SYS_RoleCompanyAccess lBS_SYS_RoleCompanyAccess)
        {
            return rolecompanyaccess.UpdateRoleCompanyAccess(lBS_SYS_RoleCompanyAccess);
        }
        public bool DeleteRoleCompanyAccessByID(Guid ID, Guid DeletedBy)
        {
            return rolecompanyaccess.DeleteRoleCompanyAccessByID(ID, DeletedBy);
        }
        public IList<LBS_SYS_Company> GetCompaniesExistsInRoleCompanyAccess(Guid RoleID)
        {
            return rolecompanyaccess.GetCompaniesExistsInRoleCompanyAccess(RoleID);
        }
        public IList<LBS_SYS_Company> GetCompaniesNotExistsInRoleCompanyAccess(Guid RoleID)
        {
            return rolecompanyaccess.GetCompaniesNotExistsInRoleCompanyAccess(RoleID);
        }
        public IList<SYS_RoleCompanyAccess> GetRoleCompanyAccessByRoleID(Guid RoleID)
        {
            return rolecompanyaccess.GetRoleCompanyAccessByRoleID(RoleID);
        }
        public bool DeleteRoleCompanyAccess(Guid AccessRoleId, Guid RoleID)
        {
            return rolecompanyaccess.DeleteRoleCompanyAccess(AccessRoleId, RoleID);
        }
        public IList<LBS_SYS_RoleCompanyWarehouseAccess> GetWareHousesNotExistsInRoleWarehouseyAccess(Guid RoleID, Guid CompanyID)
        {
            return rolecompanyaccess.GetWareHousesNotExistsInRoleWarehouseyAccess(RoleID, CompanyID);
        }
        public IList<LBS_SYS_RoleCompanyWarehouseAccess> GetWareHousesExistsInRoleWarehouseyAccess(Guid RoleID, Guid CompanyID)
        {
            return rolecompanyaccess.GetWareHousesExistsInRoleWarehouseyAccess(RoleID, CompanyID);
        }
       
        public IList<LBS_INV_Warehouse> GetWareHouses(Guid CompanyID)
        {
            return rolecompanyaccess.GetWareHouses(CompanyID);
        }
        public string AddRoleWarehouseAccess(IList<LBS_SYS_RoleCompanyWarehouseAccess> LBS_SYS_RoleCompanyWarehouseAccess)
        {
            return rolecompanyaccess.AddRoleWarehouseAccess(LBS_SYS_RoleCompanyWarehouseAccess);
        }

        public bool DeleteRoleWarehouseAccessByID(Guid RoleID, Guid WarehouseID, Guid CompanyID)
        {
            return rolecompanyaccess.DeleteRoleWarehouseAccessByID(RoleID, WarehouseID, CompanyID);
        }
      


    }
}
