using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.DTO.SYS.Common;
using LinkERP.Entity.INV;
using LinkERP.Entity.INV.InventoryAdjustment;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class Masters : BaseRepository
    {
        public IList<LBS_SYS_Module> GetModules()
        {

            var companies = con.Query<LBS_SYS_Module>("SYS_GetModule",
                            commandType: CommandType.StoredProcedure).AsList();
            return companies;
        }
        //public IList<LBS_SYS_Country> GetCountries()
        //{
        //    List<LBS_SYS_Country> lBS_SYS_Country = new List<LBS_SYS_Country>();
        //    var countries = con.Query<LBS_SYS_Country>("prcGetAllCountries",
        //                    commandType: CommandType.StoredProcedure).AsList();
        //    return countries;
        //}
        public IList<LBS_SYS_Country> GetCountries()
        {

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var countries = con.Query<LBS_SYS_Country>("SYS_Country", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return countries;
        }
        public IList<LBS_SYS_Profile> GetcheckboxCountries()
        {

            //DynamicParameters parameters = new DynamicParameters();
            //parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var countriescheck = con.Query<LBS_SYS_Profile>("checbox_countrys", 
                            commandType: CommandType.StoredProcedure).AsList();
            return countriescheck;
        }


        public IList<LBS_SYS_CountryState> GetCountryState()
        {

            var states = con.Query<LBS_SYS_CountryState>("SYS_GetAllStates",
                            commandType: CommandType.StoredProcedure).AsList();
            return states;
        }
        public IList<LBS_SYS_CountryStateCity> GetCountryStateCity()
        {

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var cities = con.Query<LBS_SYS_CountryStateCity>("[SYS_CountryStateCityManagement]", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return cities;
        }
        public IList<LBS_SYS_CountryState> GetStatesBYCountryID(Guid CountryID)
        {

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CountryID", CountryID);
            var states = con.Query<LBS_SYS_CountryState>("SYS_GetStateByCountryID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return states;
        }
        public IList<LBS_SYS_CountryStateCity> GetCitiesByStateID(Guid StateID)
        {

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@StateID", StateID);
            var cities = con.Query<LBS_SYS_CountryStateCity>("SYS_GetCityByStateID",
                                            param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return cities;
        }
        public IList<LBS_SYS_Menu> GetMenusByModuleID(string ModuleID)
        {

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ModuleID", ModuleID);
            var menus = con.Query<LBS_SYS_Menu>("SYS_GetMenusByModuleID",
                                            param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return menus;
        }

        public IList<LBS_SYS_Module> GetModulesByRokeID(Guid RoleId)
        {

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RoleID", RoleId);
            var modules = con.Query<LBS_SYS_Module>("SYS_GetModulesByRokeID",
                                            param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return modules;
        }

        public IList<LBS_SYS_User> GetUserKit()
        {

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", "SysUsers");
            var users = con.Query<LBS_SYS_User>("INV_GetRecordsforDropdowns", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return users;
        }

        public IList<LBS_SYS_WorkFlow> GetWorkFlow(Guid CompanyID)
        {
            List<LBS_SYS_WorkFlow> lBS_SYS_WorkFlows = new List<LBS_SYS_WorkFlow>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", "SysWorkflow");
            var workflow = con.Query<LBS_SYS_WorkFlow>("INV_GetRecordsforDropdowns", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return workflow;
        }

        public IList<LBS_SYS_TaxCode> GetTaxCode(Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", "SYSTaxCode");
            var taxcode = con.Query<LBS_SYS_TaxCode>("INV_GetRecordsforDropdowns", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return taxcode;
        }

        public IList<LBS_SYS_Currency> GetCurrency(Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", "SYSCurrency");
            var currency = con.Query<LBS_SYS_Currency>("INV_GetRecordsforDropdowns", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return currency;
        }

        public IList<LBS_SYS_Country> GetActiveCountries()
        {

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", "SYSCountry");
            var countries = con.Query<LBS_SYS_Country>("INV_GetRecordsforDropdowns", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return countries;
        }
        public IList<LBS_SYS_CountryStateCity> GetActiveCities()
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", "SYSCity");
            var cities = con.Query<LBS_SYS_CountryStateCity>("INV_GetRecordsforDropdowns", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return cities;
        }
        public IList<LBS_SYS_CountryState> GetActiveStates()
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", "SYSState");
            var states = con.Query<LBS_SYS_CountryState>("INV_GetRecordsforDropdowns", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return states;
        }
        public IList<LBS_ACR_Debtor> GetAllDebtors(Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", "SYSDebtors");
            var states = con.Query<LBS_ACR_Debtor>("INV_GetRecordsforDropdowns", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return states;
        }

        public IList<Frequency> GetFrequency(Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", "Frequency");
            var data = con.Query<Frequency>("SYS_GetMasterRecords", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return data;
        }

        public IList<ReportNames> GetReportNames()
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@Action", "ReportNames");
            var data = con.Query<ReportNames>("SYS_GetMasterRecords", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return data;
        }

        public IList<Users> GetUsers()
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@Action", "Users");

            var data = con.Query<Users>("SYS_GetMasterRecords", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return data;
        }
        public IList<LBS_INV_InventoryAdjustment> GetAdjustments(Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", "Adjustment");
            var adjustment = con.Query<LBS_INV_InventoryAdjustment>("INV_GetRecordsforDropdowns", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return adjustment;
        }

    }
}
