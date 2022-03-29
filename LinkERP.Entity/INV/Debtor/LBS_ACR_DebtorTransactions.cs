using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Debtor
{
    public class LBS_ACR_DebtorTransactions
    {
        public Guid ID { get; set; }
        public Guid CompanyID { get; set; }
        public Guid DebtorID { get; set; }
        public Guid ParentDebtorID { get; set; }
        public bool DebitCredit { get; set; }
        public string SourceReference { get; set; }
        public string InvoiceNotes1 { get; set; }
        public string InvoiceNotes2 { get; set; }
        public string TransactionDate  { get; set; }
        public string TransactionReferenceNumber { get; set; }
        public decimal TransactionAmountHome { get; set; }        public decimal AllocatedAmountHome { get; set; }
        public decimal UnAllocatedAmountHome { get; set; }
        public string DueDate  { get; set; }
        public decimal FXAmount { get; set; }
        public decimal FXAllocAmount { get; set; }
        public decimal CurrencyRateUsed { get; set; }
        public decimal RealisedGainLoss { get; set; }
        public decimal UnRealisedGainLoss { get; set; }
        public string CurrencyID { get; set; }
        public string CreatedBY { get; set; }
        public bool Deleted { get; set; }
        public string DebtorAccountName { get; set; }
        public string DebtorCode { get; set; }
        public decimal AmountToallocate { get; set; }
        public decimal AllocateAmountToDisplay { get; set; }
        public Guid ReceiptDetailID { get; set; }

    }
}
