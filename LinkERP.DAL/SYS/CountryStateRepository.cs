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
   public class CountryStateRepository: BaseRepository, ICountryStateRepository
    {
       
        public LBS_SYS_CountryState GetCountryStateByID (Guid ID)
        {
            List<LBS_SYS_CountryState> lBS_SYS_Companies = new List<LBS_SYS_CountryState>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var countrystatedetails  = con.Query<LBS_SYS_CountryState>("SYS_CountryStateManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return countrystatedetails;
        }
        public string AddCountryState (LBS_SYS_CountryState lBS_SYS_CountryState )
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CountryID", lBS_SYS_CountryState.CountryID);
            parameters.Add("@Name", lBS_SYS_CountryState.Name);
            parameters.Add("@Code", lBS_SYS_CountryState.StateCode);
            parameters.Add("@CreatedBY", lBS_SYS_CountryState.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Add.GetDescription());

            parameters.Add("@StateID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_CountryStateManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@StateID");
            return id;
        }
        public string UpdateCountryState(LBS_SYS_CountryState lBS_SYS_CountryState )
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", lBS_SYS_CountryState.ID);
            parameters.Add("@CountryID", lBS_SYS_CountryState.CountryID);
            parameters.Add("@Name", lBS_SYS_CountryState.Name);
            parameters.Add("@Code", lBS_SYS_CountryState.StateCode);
            parameters.Add("@Action", ActionsForSP.Edit.GetDescription());
            parameters.Add("@StateID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
            SqlMapper.Query(con, "SYS_CountryStateManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@StateID");
            return id;
        }
        public bool DeleteCountryStateByID(Guid ID, string DeletedBy)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", ID);
            parameters.Add("@DeletedBy", DeletedBy);

            SqlMapper.Query(con, "SYS_DeleteCountryStateByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);

            return true;
        }
        public IList<LBS_SYS_CountryState> GetStateByCountryID(Guid CountryID)
        {
            DynamicParameters parameters = new DynamicParameters();  
            parameters.Add("@CountryID", CountryID);
            parameters.Add("@Action", ActionsForSP.SelectBYRecID.GetDescription());
            var CountryState = con.Query<LBS_SYS_CountryState>("SYS_CountryStateManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return CountryState;
        }

    }
}
