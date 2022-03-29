using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.SYS.BankAccountMapping
{
   public class BankAccountsMapping
    {
        //ID							
        public Guid? ID { get; set; }
        public Guid BankCodeFromID { get; set; }
        public Guid BankCodeToID { get; set; }
        public string BankCodeTo { get; set; }
        public string BankName { get; set; }
        public string BankNumber { get; set; }
        public bool Deleted { get; set; }
        public string DeleteStatus { get; set; }
    }
}
