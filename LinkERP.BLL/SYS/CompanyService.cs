using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class CompanyService : ICompanyService
    {
        ICompanyRepository company;
        public CompanyService(ICompanyRepository _company)
        {
            company = _company;
        }

        public string AddCompany(LBS_SYS_Company lBS_SYS_Company)
        {
            return company.AddCompany(lBS_SYS_Company);
        }

        public bool DeleteCompanyByID(Guid ID, string DeletedBy)
        {
            return company.DeleteCompanyByID(ID, DeletedBy);
        }

        public IList<LBS_SYS_Company> GetAllCompanies()
        {
            return company.GetAllCompanies();
        }

        public IList<LBS_SYS_Company> GetCompanies()
        {
            return company.GetCompanies();
        }

        public LBS_SYS_Company GetCompanyByID(Guid ID)
        {
            return company.GetCompanyByID(ID);
        }

        public string UpdateCompany(LBS_SYS_Company lBS_SYS_Company)
        {
            return company.UpdateCompany(lBS_SYS_Company);
        }
    }
}
