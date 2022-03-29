using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS.Interfaces
{
    public interface ICompanyService
    {
        string AddCompany(LBS_SYS_Company lBS_SYS_Company);
        string UpdateCompany(LBS_SYS_Company lBS_SYS_Company);
        IList<LBS_SYS_Company> GetCompanies();
        IList<LBS_SYS_Company> GetAllCompanies();
        LBS_SYS_Company GetCompanyByID(Guid ID);
        bool DeleteCompanyByID(Guid ID, string DeletedBy);
    }
}
