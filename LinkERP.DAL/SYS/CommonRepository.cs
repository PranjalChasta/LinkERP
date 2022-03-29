using LinkERP.DAL.SYS.Interfaces;
using LinkERP.DTO.SYS.Common;
using LinkERP.Entity.INV;
using LinkERP.Entity.INV.InventoryAdjustment;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class CommonRepository : ICommonRepository
    {
        public IList<LBS_SYS_Company> GetCompanies()
        {
            CompanyRepository companyRepository = new CompanyRepository();
            return companyRepository.GetCompanies();
        }
        public IList<LBS_SYS_Module> GetModules()
        {
            Masters moduleRepository = new Masters();
            return moduleRepository.GetModules();
        }
        public IList<LBS_SYS_RoleCompanyAccess> GetRoleCompanyAccesses()
        {
            RoleCompanyAccessRepository moduleRepository = new RoleCompanyAccessRepository();
            return moduleRepository.GetRoleCompanyAccesses();
        }
        public IList<LBS_SYS_Country> GetCountries()
        {
            Masters country = new Masters();
            return country.GetCountries();
        }

        public IList<LBS_SYS_Profile> GetcheckboxCountries()
        {
            Masters country = new Masters();
            return country.GetcheckboxCountries();
            
        }

        public IList<LBS_SYS_CountryState> GetCountryState()
        {
            Masters state = new Masters();
            return state.GetCountryState();
        }
        public IList<LBS_SYS_CountryStateCity> GetCountryStateCity()
        {
            Masters city = new Masters();
            return city.GetCountryStateCity();
        }
        public IList<LBS_SYS_CountryState> GetStatesBYCountryID(Guid CountryID)
        {
            Masters countrybystatename = new Masters();
            return countrybystatename.GetStatesBYCountryID(CountryID);
        }
        public IList<LBS_SYS_CountryStateCity> GetCitiesByStateID(Guid StateID)
        {
            Masters statebycityname = new Masters();
            return statebycityname.GetCitiesByStateID(StateID);
        }
        public IList<LBS_SYS_Menu> GetMenusByModuleID(string ModuleID)
        {
            Masters masters = new Masters();
            return masters.GetMenusByModuleID(ModuleID);
        }
        public IList<LBS_SYS_Module> GetModulesByRokeID(Guid RoleId)
        {
            Masters masters = new Masters();
            return masters.GetModulesByRokeID(RoleId);
        }

        public IList<LBS_SYS_Role> GetRoles()
        {
            RoleRepository roleRepository = new RoleRepository();
            return roleRepository.GetRoles();
        }

        public IList<LBS_SYS_User> GetUserKit()
        {
            Masters Product = new Masters();
            return Product.GetUserKit();
        }

        public IList<LBS_SYS_WorkFlow> GetWorkFlow(Guid CompanyID)
        {
            Masters workflow = new Masters();
            return workflow.GetWorkFlow(CompanyID);
        }

        public IList<LBS_SYS_TaxCode> GetTaxCode(Guid CompanyID)
        {
            Masters taxcode = new Masters();
            return taxcode.GetTaxCode(CompanyID);
        }

        public IList<LBS_SYS_Currency> GetCurrency(Guid CompanyID)
        {
            Masters currency = new Masters();
            return currency.GetCurrency(CompanyID);
        }
        public IList<LBS_SYS_Country> GetActiveCountries()
        {
            Masters country = new Masters();
            return country.GetActiveCountries();
        }
        public IList<LBS_SYS_CountryStateCity> GetActiveCities()
        {
            Masters cities = new Masters();
            return cities.GetActiveCities();
        }
        public IList<LBS_SYS_CountryState> GetActiveStates()
        {
            Masters states = new Masters();
            return states.GetActiveStates();
        }
        public IList<LBS_ACR_Debtor> GetAllDebtors(Guid CompanyID)
        {
            Masters debtors = new Masters();
            return debtors.GetAllDebtors(CompanyID);
        }
        public IList<Frequency> GetFrequency(Guid CompanyID)
        {
            Masters masters = new Masters();
            return masters.GetFrequency(CompanyID);
        }

        public IList<ReportNames> GetReportNames()
        {
            Masters masters = new Masters();
            return masters.GetReportNames();
        }
        public IList<Users> GetUsers()
        {
            Masters masters = new Masters();
            return masters.GetUsers();
        }
        public IList<LBS_INV_InventoryAdjustment> GetAdjustments(Guid CompanyID)
        {
            Masters adjustment = new Masters();
            return adjustment.GetAdjustments(CompanyID);
        }

      
    }
}
