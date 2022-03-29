using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public static class LBSTest
    {
        public static Guid CompanyID { get; set; }
    }
        public class LBS_SYS_Company : BaseEntity
    {
        public string CompanyCode { get; set; }
        public string Name { get; set; }
        public string TradingName { get; set; }
        public string Laddr1 { get; set; }
        public string Laddr2 { get; set; }
        public string Laddr3 { get; set; }
        public string Paddr1 { get; set; }
        public string Paddr2 { get; set; }
        public string Paddr3 { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
        public string TaxNumber { get; set; }
        public string SuperannuationID { get; set; }
        public string DefaultPayrollRounding { get; set; }
        public Guid DefaultCurrency { get; set; }
        public byte[] Logo { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string EmailAddress { get; set; }

    }
}
