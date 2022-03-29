using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface ICurrencyRepository
    {
        IList<LBS_SYS_Currency> GetCurrencies(Guid CompanyID);
        string AddCurrency(LBS_SYS_Currency lBS_SYS_Currency);
        string UpdateCurrency(LBS_SYS_Currency lBS_SYS_Currency);
        LBS_SYS_Currency GetCurrencyByID(Guid ID);

        //Currency rate
        IList<LBS_SYS_CurrencyRates> GetCurrencyRates();
        IList<LBS_SYS_CurrencyRates> GetCurrencyRatesExchange(Guid CurrencyID);
        string AddCurrencyRate(LBS_SYS_CurrencyRates lBS_SYS_CurrencyRates);
        string UpdateCurrencyRate(LBS_SYS_CurrencyRates lBS_SYS_CurrencyRates);
        LBS_SYS_CurrencyRates GetCurrencyRateByID(Guid ID);
    }
}
