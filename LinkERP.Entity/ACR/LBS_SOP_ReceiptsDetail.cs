using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.ACR
{
   public class LBS_SOP_ReceiptsDetail
    {
        public Guid ID { get; set; }
        public Guid WareHouseID { get; set; }
        public Guid CompanyID { get; set; }
        public Guid ReceiptMainID { get; set; }
        public string ReceiptNumber { get; set; }
        public string PaymentLineNo { get; set; }
        public string PaymentDate { get; set; }
        public string ShiftID { get; set; }
        public Guid DebtorID { get; set; }
        public string Description { get; set; }
        public string PaymentType { get; set; }
        public decimal HomeAmount { get; set; }
        public string Currency { get; set; }
        public decimal ExchangeRate { get; set; }
        public decimal ForeignAmount { get; set; }
        public decimal CustomerPaidAmount { get; set; }
        public decimal CustomerChangeGiven { get; set; }
        public decimal AllocatedAmount { get; set; }
        public decimal AvailableAmount { get; set; }
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
        public bool Deleted { get; set; }
        public string DeletedBy { get; set; }
    }
}
