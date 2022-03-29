using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class CurrencyService: ICurrencyService
    {
        ICurrencyRepository currency;
        public CurrencyService(ICurrencyRepository _currency)
        {
            currency = _currency;
        }

        public string AddCurrency(LBS_SYS_Currency lBS_SYS_Currency)
        {
            return currency.AddCurrency(lBS_SYS_Currency);
        }
        public string UpdateCurrency(LBS_SYS_Currency lBS_SYS_Currency)
        {
            return currency.UpdateCurrency(lBS_SYS_Currency);
        }
        public LBS_SYS_Currency GetCurrencyByID(Guid ID)
        {
            return currency.GetCurrencyByID(ID);
        }
        public IList<LBS_SYS_Currency> GetCurrencies(Guid CompanyID)
        {
            return currency.GetCurrencies(CompanyID);
        }
        //Currency Rates

        public IList<LBS_SYS_CurrencyRates> GetCurrencyRates()
        {
            return currency.GetCurrencyRates();
        }
        public IList<LBS_SYS_CurrencyRates> GetCurrencyRatesExchange(Guid CurrencyID)
        {
            return currency.GetCurrencyRatesExchange(CurrencyID);
        }

        public string AddCurrencyRate(LBS_SYS_CurrencyRates lBS_SYS_CurrencyRates)
        {
            return currency.AddCurrencyRate(lBS_SYS_CurrencyRates);
        }
        public string UpdateCurrencyRate(LBS_SYS_CurrencyRates lBS_SYS_CurrencyRates)
        {
            return currency.UpdateCurrencyRate(lBS_SYS_CurrencyRates);
        }
        public LBS_SYS_CurrencyRates GetCurrencyRateByID(Guid ID)
        {
            return currency.GetCurrencyRateByID(ID);
        }
    }
}
