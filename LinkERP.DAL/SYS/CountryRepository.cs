using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class CountryRepository :BaseRepository,ICountryRepository
    {
       
        public string AddCountry(LBS_SYS_Country lBS_SYS_Country)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CountryCode", lBS_SYS_Country.CountryCode);
            parameters.Add("@Name", lBS_SYS_Country.Name);
            parameters.Add("@CreatedBY", lBS_SYS_Country.CreatedBY);
            parameters.Add("@ID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_AddorUpdateCountryManangement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@ID");
            return id;
        }
        
        public string UpdateCountry(LBS_SYS_Country lBS_SYS_Country)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CountryID", lBS_SYS_Country.CountryID);
            parameters.Add("@CountryCode", lBS_SYS_Country.CountryCode);
            parameters.Add("@Name", lBS_SYS_Country.Name);
            parameters.Add("@CreatedBY", lBS_SYS_Country.CreatedBY);
            parameters.Add("@ID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_AddorUpdateCountryManangement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@ID");
            return id;
        }
       
        public LBS_SYS_Country GetCountryByID(Guid CountryID)
        {
            List<LBS_SYS_Country> lBS_SYS_WorkFlow = new List<LBS_SYS_Country>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            parameters.Add("@CountryID", CountryID);
            var country = con.Query<LBS_SYS_Country>("SYS_Country",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return country;
        }
        public bool DeleteCountryByID(Guid ID, string DeletedBy)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@CountryID", ID);
            parameters.Add("@DeletedBy", DeletedBy);

            SqlMapper.Query(con, "SYS_DeleteCountryByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);

            return true;
        }
    }
}
