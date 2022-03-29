using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface ICountryStateCityRepository
    {
        string AddCity(LBS_SYS_CountryStateCity lBS_SYS_CountryStateCity);
        string UpdateCity(LBS_SYS_CountryStateCity lBS_SYS_CountryStateCity);
        bool DeleteCityByID(Guid ID, string DeletedBy);
        LBS_SYS_CountryStateCity GetCityByID(Guid CityID);

        IList<LBS_SYS_CountryStateCity> GetCityByStateID(Guid StateID);
    }
}
