using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
   public class CountryStateService: ICountryStateService
    {
        ICountryStateRepository country ;
        public CountryStateService (ICountryStateRepository _country )
        {
            country = _country;
        }

        public string AddCountryState (LBS_SYS_CountryState lBS_SYS_countrystate )
        {
            return country.AddCountryState(lBS_SYS_countrystate);
        }

        public bool DeleteCountryStateByID(Guid ID, string DeletedBy)
        {
            return country.DeleteCountryStateByID(ID, DeletedBy);
        }

        public LBS_SYS_CountryState GetCountryStateByID (Guid ID)
        {
            return country.GetCountryStateByID(ID);
        }

        public string UpdateCountryState(LBS_SYS_CountryState lBS_SYS_countrystate)
        {
            return country.UpdateCountryState(lBS_SYS_countrystate);
        }

        public IList<LBS_SYS_CountryState> GetStateByCountryID(Guid CountryID)
        {
            return country.GetStateByCountryID(CountryID);
        }
    }
}
