using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.ACR
{
  public  class PreviousTranction
    {
        public Guid ReceptID { get; set; }
        public Guid CompanyID { get; set; }
        public Guid ReceiptMainID { get; set; }
        public string ReceiptNumber { get; set; }
        public string PaymentLineNo { get; set; }
        public string AllocatedDate { get; set; }
        public string PaymentDate { get; set; }
        public string ShiftID { get; set; }
        public Guid DebtorID { get; set; }
        public string SalesOrderNo { get; set; }
        public Guid OrderMainID { get; set; }
        public decimal AllocatedAmount { get; set; }
        public decimal InvoiceTotal { get; set; }
        public decimal receptAllocated { get; set; }
    }
}
