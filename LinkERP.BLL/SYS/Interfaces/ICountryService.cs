using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS.Interfaces
{
    public interface ICountryService
    {
        string AddCountry(LBS_SYS_Country lBS_SYS_Country);
        string UpdateCountry(LBS_SYS_Country lBS_SYS_Country);
        LBS_SYS_Country GetCountryByID(Guid CountryID);
        bool DeleteCountryByID(Guid ID, string DeletedBy);
    }
}
