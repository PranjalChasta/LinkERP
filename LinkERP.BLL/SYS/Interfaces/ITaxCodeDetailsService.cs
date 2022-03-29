using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS.Interfaces
{
    public interface ITaxCodeDetailsService
    {
        string AddTaxCodeDetails(LBS_SYS_TaxCodeDetail lBS_SYS_TaxCodeDetail);
        string UpdateTaxCodeDetails(LBS_SYS_TaxCodeDetail lBS_SYS_TaxCodeDetail);
        IList<LBS_SYS_TaxCodeDetail> GetAllTaxCodeDetails();
        LBS_SYS_TaxCodeDetail GetTaxCodeDetailsByID(Guid ID);
        IList<LBS_SYS_TaxCodeDetail> GetTaxCodeDetailsByTaxCodeID(Guid ID);
        //LBS_SYS_TaxCodeDetail GetTaxCodeDetailsByTaxCodeID(Guid ID);

        string AddUpdateTaxcodeData(string lBS_SYS_TaxCodeDetail);
    }
}
