using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.Account.ForgotPassword
{
    public class ResetSecurityQuestion
    {
        public string LoginID { get; set; }
        public string SecurityQuestion { get; set; }
        public string SecurityAnswer { get; set; }
    }
}
