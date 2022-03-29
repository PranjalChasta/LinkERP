using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
   public class CountryStateCityService : ICountryStateCityService
    {
        ICountryStateCityRepository city;
        public CountryStateCityService(ICountryStateCityRepository _city)
        {
            city = _city;
        }

        public string AddCity(LBS_SYS_CountryStateCity lBS_SYS_CountryStateCity)
        {
            return city.AddCity(lBS_SYS_CountryStateCity);
        }
        public string UpdateCity(LBS_SYS_CountryStateCity lBS_SYS_CountryStateCity)
        {
            return city.UpdateCity(lBS_SYS_CountryStateCity);
        }
        public LBS_SYS_CountryStateCity GetCityByID(Guid CityID)
        {
            return city.GetCityByID(CityID);
        }

        public bool DeleteCityByID(Guid ID, string  DeletedBy)
        {
            return city.DeleteCityByID(ID, DeletedBy);
        }

        public IList<LBS_SYS_CountryStateCity> GetCityByStateID(Guid StateID)
        {
            return city.GetCityByStateID(StateID);
        }
    }
}
