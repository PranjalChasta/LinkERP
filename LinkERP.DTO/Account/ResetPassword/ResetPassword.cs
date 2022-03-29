using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.Account.ResetPassword
{
    public class ResetPassword
    {
        public string ResetCode { get; set; }
        public string LoginID { get; set; }
        public string Password { get; set; }
    }
}
