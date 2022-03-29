using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface ITaxCodeRepository
    {
        string AddTaxCode(LBS_SYS_TaxCode lBS_SYS_TaxCode);
        string UpdateTaxCode(LBS_SYS_TaxCode lBS_SYS_TaxCode);
        IList<LBS_SYS_TaxCode> GetAllTaxCode(Guid CompanyID);
        LBS_SYS_TaxCode GetTaxCodeByID(Guid ID);


    }
}
