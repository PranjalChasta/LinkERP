using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_POS_QuotationMail
    {
        public string FromMail { get; set; }
        public string ToMail { get; set; }
        public string Subject { get; set; }
        public string  MessageBody { get; set; }
    }
}
