using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.Utilities
{
    public class LoginUser
    {
        public string LoginID { get; set; }
        public string LoginName { get; set; }
        public string Password { get; set; }
        public string AuthenticationMode { get; set; }
        public string WindowsUserName { get; set; }
        public bool ResetPassword { get; set; }
        public bool ForcePasswordChange { get; set; }
        public Guid DefaultCompanyID { get; set; }
        public string Token { get; set; }
        public Guid CompanyID { get; set; }
        public string LoginAvator { get; set; }
        public bool LogOnStatus { get; set; }

    }
}
