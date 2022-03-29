using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;
namespace LinkERP.BLL.SYS
{
    public class CountryService :ICountryService
    {
        ICountryRepository country ;
        public CountryService(ICountryRepository _country)
        {
            country = _country;
        }
        public string AddCountry(LBS_SYS_Country  lBS_SYS_Country)
        {
            return country.AddCountry(lBS_SYS_Country);
        }
        public string UpdateCountry(LBS_SYS_Country lBS_SYS_Country)
        {
            return country.UpdateCountry(lBS_SYS_Country);
        }
        public LBS_SYS_Country GetCountryByID(Guid CountryID)
        {
            return country.GetCountryByID(CountryID);
        }
        public bool DeleteCountryByID(Guid ID, string DeletedBy)
        {
            return country.DeleteCountryByID(ID, DeletedBy);
        }

    }
}

