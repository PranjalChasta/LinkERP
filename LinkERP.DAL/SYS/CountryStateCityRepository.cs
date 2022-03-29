using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SYS
{
   public  class CountryStateCityRepository:BaseRepository, ICountryStateCityRepository
    {
        public LBS_SYS_CountryStateCity GetCityByID(Guid CityID)
        {
            List<LBS_SYS_CountryStateCity> lBS_SYS_Companies = new List<LBS_SYS_CountryStateCity>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CityID", CityID);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var companies = con.Query<LBS_SYS_CountryStateCity>("[SYS_CountryStateCityManagement]",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return companies;
        }
        public string AddCity(LBS_SYS_CountryStateCity lBS_SYS_CountryStateCity)
        {
            DynamicParameters parameters = new DynamicParameters(); 
            //parameters.Add("@ID", lBS_SYS_Company.ID); 
            parameters.Add("@CountryID", lBS_SYS_CountryStateCity.CountryID);
            parameters.Add("@StateID", lBS_SYS_CountryStateCity.StateID);
            parameters.Add("@CityCode", lBS_SYS_CountryStateCity.CityCode);
            parameters.Add("@Name", lBS_SYS_CountryStateCity.Name);
            parameters.Add("@CreatedBY", lBS_SYS_CountryStateCity.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Add.GetDescription());
            parameters.Add("@CityResponseID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output); 
            SqlMapper.Query(con, "[SYS_CountryStateCityManagement]",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@CityResponseID");
            return id;
        }
        public string UpdateCity(LBS_SYS_CountryStateCity lBS_SYS_CountryStateCity)
        {
            DynamicParameters parameters = new DynamicParameters(); 
            parameters.Add("@CityID", lBS_SYS_CountryStateCity.CityID);
            parameters.Add("@CountryID", lBS_SYS_CountryStateCity.CountryID);
            parameters.Add("@StateID", lBS_SYS_CountryStateCity.StateID);
            parameters.Add("@CityCode", lBS_SYS_CountryStateCity.CityCode);
            parameters.Add("@Name", lBS_SYS_CountryStateCity.Name);
            parameters.Add("@CreatedBY", lBS_SYS_CountryStateCity.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Edit.GetDescription());
            parameters.Add("@CityResponseID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output); 
            SqlMapper.Query(con, "[SYS_CountryStateCityManagement]",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@CityResponseID");
            return id;
        }
        public bool DeleteCityByID(Guid ID, string DeletedBy)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", ID);
            parameters.Add("@DeletedBy", DeletedBy); 
            SqlMapper.Query(con, "SYS_DeleteCitiesByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure); 
            return true;
        }
        public IList<LBS_SYS_CountryStateCity> GetCityByStateID(Guid StateID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@StateID", StateID);
            parameters.Add("@Action", ActionsForSP.SelectBYRecID.GetDescription());
            var CountryState = con.Query<LBS_SYS_CountryStateCity>("SYS_CountryStateCityManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return CountryState;
        }
        
    }
}
