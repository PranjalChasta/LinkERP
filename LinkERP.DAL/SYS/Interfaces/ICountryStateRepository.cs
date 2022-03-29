using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
   public interface ICountryStateRepository
    {
        string AddCountryState(LBS_SYS_CountryState lBS_SYS_CountryState);
        string UpdateCountryState(LBS_SYS_CountryState lBS_SYS_CountryState);
        LBS_SYS_CountryState GetCountryStateByID(Guid ID);
        bool DeleteCountryStateByID(Guid ID, string DeletedBy);
        IList<LBS_SYS_CountryState> GetStateByCountryID(Guid CountryID);
    }
}
