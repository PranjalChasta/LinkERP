using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.ACR.DebtorRefund
{
   public  class LBS_SOP_RefundDetail
    {
        public Guid ID { get; set; }
        public Guid CompanyID { get; set; }
        public Guid WareHouseID { get; set; }
        public Guid RefundMainID { get; set; }
        public string RefundLineNo { get; set; }
        public string RefundNumber { get; set; }
        public DateTime RefundDate { get; set; }
        public string ShiftID { get; set; }
        public Guid DebtorID { get; set; }
        public string PaymentType { get; set; }
        public decimal HomeRefundAmount { get; set; }
        public string Currency { get; set; }
        public decimal ExchangeRate { get; set; }
        public decimal ForeignRefundAmount { get; set; }
        public bool ShiftReconciled { get; set; }
        public bool BankReconciled { get; set; }
        public string TransactionSourceReference { get; set; }
        public string PaymentDetail1 { get; set; }
        public string PaymentDetail2 { get; set; }
        public string PaymentDetail3 { get; set; }
        public string PaymentDetail4 { get; set; }
        public string PaymentDetail5 { get; set; }
        public string PaymentDetail6 { get; set; }
        public string PaymentDetail7 { get; set; }
        public string PaymentDetail8 { get; set; }
        public string CreatedBY { get; set; }
    }
}
