using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LinkERPPOS.DTO.Shift
{
   public  class LBS_SOP_Shift_Detail
    {
       public Guid ID { get; set; }
        public Guid CompanyID { get; set; }
        public string ShiftID { get; set; }
        public string PaymentType { get; set; }
        public decimal SystemTotal { get; set; }
        public decimal TillTotal { get; set; }
        public decimal Variance { get; set; }
        public string Currency { get; set; }
        public bool MultiCurrency { get; set; }
        public decimal ExchangeRate { get; set; }
        public decimal SystemTotalHome { get; set; }
        public decimal TillTotalHome { get; set; }
        public decimal VarianceHome { get; set; }
        public DateTime CloseDateTime { get; set; }
        public string CloseAuthorisedBy { get; set; }
        public Guid BankDepositNumber { get; set; }

        public string CreatedBY { get; set; }



    }
}
