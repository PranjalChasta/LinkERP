using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_POS_GiftVoucher : BaseEntity
    {
        public string SourceID { get; set; }
        public string GiftVoucherSerial { get; set; }
        public DateTime IssuedDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public decimal VoucherValue { get; set; }
        public string Status { get; set; }
        public Guid CompanyID { get; set; }
        public string RedeemedtransactionReference { get; set; }

    }
}
