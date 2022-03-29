using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class TaxCodeService :ITaxCodeService
    {
        ITaxCodeRepository taxCode ;
        public TaxCodeService(ITaxCodeRepository _taxCodeRepository)
        {
            taxCode = _taxCodeRepository;
        }
        public string AddTaxCode(LBS_SYS_TaxCode lBS_SYS_TaxCode)
        {
            return taxCode.AddTaxCode(lBS_SYS_TaxCode);
        }
        public string UpdateTaxCode(LBS_SYS_TaxCode lBS_SYS_TaxCode)
        {
            return taxCode.UpdateTaxCode(lBS_SYS_TaxCode);
        }
        //public IList<LBS_SYS_TaxCode> GetAllTaxCode()
        //{
        //    return taxCode.GetAllTaxCode();
        //}
        //public LBS_SYS_TaxCode GetTaxCodeByID(Guid ID)
        //{
        //    return taxCode.GetTaxCodeByID(ID);
        //}

        public IList<LBS_SYS_TaxCode> GetAllTaxCode(Guid CompanyID)
        {
            return taxCode.GetAllTaxCode(CompanyID);
        }
        public LBS_SYS_TaxCode GetTaxCodeByID(Guid ID)
        {
            return taxCode.GetTaxCodeByID(ID);
        }
    }
}
