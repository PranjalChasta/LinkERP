using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;


namespace LinkERP.BLL.SYS
{
    public class TaxCodeDetailsService :ITaxCodeDetailsService
    {
        ITaxCodeDetailsRepository taxCodeDetails ;
        public TaxCodeDetailsService(ITaxCodeDetailsRepository _taxCodeDetails)
        {
            taxCodeDetails = _taxCodeDetails;
        }

        public string AddTaxCodeDetails(LBS_SYS_TaxCodeDetail lBS_SYS_TaxCodeDetail)
        {
            return taxCodeDetails.AddTaxCodeDetails(lBS_SYS_TaxCodeDetail);
        }
        public string UpdateTaxCodeDetails(LBS_SYS_TaxCodeDetail lBS_SYS_TaxCodeDetail)
        {
            return taxCodeDetails.UpdateTaxCodeDetails(lBS_SYS_TaxCodeDetail);
        }
        public IList<LBS_SYS_TaxCodeDetail> GetAllTaxCodeDetails()
        {
            return taxCodeDetails.GetAllTaxCodeDetails();
        }
        public LBS_SYS_TaxCodeDetail GetTaxCodeDetailsByID(Guid ID)
        {
            return taxCodeDetails.GetTaxCodeDetailsByID(ID);
        }
        public IList<LBS_SYS_TaxCodeDetail> GetTaxCodeDetailsByTaxCodeID(Guid ID)
        {
            return taxCodeDetails.GetTaxCodeDetailsByTaxCodeID(ID);
        }
        //public LBS_SYS_TaxCodeDetail GetTaxCodeDetailsByTaxCodeID(Guid ID)
        //{
        //    return taxCodeDetails.GetTaxCodeDetailsByTaxCodeID(ID);
        //}
        public string AddUpdateTaxcodeData(string lBS_SYS_TaxCodeDetail)
        {
            return taxCodeDetails.AddUpdateTaxcodeData(lBS_SYS_TaxCodeDetail);
        }
    }
}
