using LinkERP.DTO.SYS.Common;
using LinkERP.Entity.INV;
using LinkERP.Entity.INV.InventoryAdjustment;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface ICommonRepository
    {
        IList<LBS_SYS_Company> GetCompanies();
        IList<LBS_SYS_Module> GetModules();
        IList<LBS_SYS_RoleCompanyAccess> GetRoleCompanyAccesses();

        IList<LBS_SYS_Country> GetCountries();
        IList<LBS_SYS_Profile> GetcheckboxCountries();
        IList<LBS_SYS_CountryState> GetCountryState();
        IList<LBS_SYS_CountryStateCity> GetCountryStateCity();

        IList<LBS_SYS_CountryState> GetStatesBYCountryID(Guid CountryID);
        IList<LBS_SYS_CountryStateCity> GetCitiesByStateID(Guid StateID);
        IList<LBS_SYS_Menu> GetMenusByModuleID(string ModuleID);
        IList<LBS_SYS_Module> GetModulesByRokeID(Guid RoleId);
        IList<LBS_SYS_Role> GetRoles();
        IList<LBS_SYS_User> GetUserKit();
        IList<LBS_SYS_WorkFlow> GetWorkFlow(Guid CompanyID);
        IList<LBS_SYS_TaxCode> GetTaxCode(Guid CompanyID);
        IList<LBS_SYS_Currency> GetCurrency(Guid CompanyID);
        IList<LBS_SYS_Country> GetActiveCountries();
        IList<LBS_SYS_CountryStateCity> GetActiveCities();
        IList<LBS_SYS_CountryState> GetActiveStates();
        IList<LBS_ACR_Debtor> GetAllDebtors(Guid CompanyID);
        IList<Frequency> GetFrequency(Guid CompanyID);
        IList<ReportNames> GetReportNames();
        IList<Users> GetUsers();
        IList<LBS_INV_InventoryAdjustment> GetAdjustments(Guid CompanyID);
    }
}
