using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.DTO.SYS.Common;
using LinkERP.Entity.INV;
using LinkERP.Entity.INV.InventoryAdjustment;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class CommonService : ICommonService
    {
        ICommonRepository commonRepository;
        public CommonService(ICommonRepository _commonRepository)
        {
            commonRepository = _commonRepository;
        }
        public IList<LBS_SYS_Company> GetCompanies()
        {
            return commonRepository.GetCompanies();
        }
        public IList<LBS_SYS_Module> GetModules()
        {
            return commonRepository.GetModules();
        }
        public IList<LBS_SYS_RoleCompanyAccess> GetRoleCompanyAccesses()
        {
            return commonRepository.GetRoleCompanyAccesses();
        }
        public IList<LBS_SYS_Country> GetCountries()
        {
            return commonRepository.GetCountries();
        }

        public IList<LBS_SYS_Profile> GetcheckboxCountries()
        {
            return commonRepository.GetcheckboxCountries();
        }


        public IList<LBS_SYS_CountryState> GetCountryState()
        {
            return commonRepository.GetCountryState();
        }
        public IList<LBS_SYS_CountryStateCity> GetCountryStateCity()
        {
            return commonRepository.GetCountryStateCity();
        }
      
        public IList<LBS_SYS_CountryState> GetStatesBYCountryID(Guid CountryID)
        {
            return commonRepository.GetStatesBYCountryID(CountryID);
        }
        public IList<LBS_SYS_CountryStateCity> GetCitiesByStateID(Guid StateID)
        {
            return commonRepository.GetCitiesByStateID(StateID);
        }
        public IList<LBS_SYS_Menu> GetMenusByModuleID(string ModuleID)
        {
            return commonRepository.GetMenusByModuleID(ModuleID);
        }
        public IList<LBS_SYS_Module> GetModulesByRokeID(Guid RoleId)
        {
            return commonRepository.GetModulesByRokeID(RoleId);
        }
        public IList<LBS_SYS_Role> GetRoles()
        {
            return commonRepository.GetRoles();
        }
        public IList<LBS_SYS_User> GetUserKit()
        {
            return commonRepository.GetUserKit();
        }
        public IList<LBS_SYS_WorkFlow> GetWorkFlow(Guid CompanyID)
        {
            return commonRepository.GetWorkFlow(CompanyID);
        }

        public IList<LBS_SYS_TaxCode> GetTaxCode(Guid CompanyID)
        {
            return commonRepository.GetTaxCode(CompanyID);
        }

        public IList<LBS_SYS_Currency> GetCurrency(Guid CompanyID)
        {
            return commonRepository.GetCurrency(CompanyID);
        }
        public IList<LBS_SYS_Country> GetActiveCountries()
        {
            return commonRepository.GetActiveCountries();
        }
        public IList<LBS_SYS_CountryStateCity> GetActiveCities()
        {
            return commonRepository.GetActiveCities();
        }
        public IList<LBS_SYS_CountryState> GetActiveStates()
        {
            return commonRepository.GetActiveStates();
        }
        public IList<LBS_ACR_Debtor> GetAllDebtors(Guid CompanyID)
        {
            return commonRepository.GetAllDebtors(CompanyID);
        }
        public IList<Frequency> GetFrequency(Guid CompanyID)
        {
            return commonRepository.GetFrequency(CompanyID);
        }
        public IList<ReportNames> GetReportNames()
        {
            return commonRepository.GetReportNames();
        }
        public IList<Users> GetUsers()
        {
            return commonRepository.GetUsers();
        }
        public IList<LBS_INV_InventoryAdjustment> GetAdjustments(Guid CompanyID)
        {
            return commonRepository.GetAdjustments(CompanyID);
        }

       
    }
}
