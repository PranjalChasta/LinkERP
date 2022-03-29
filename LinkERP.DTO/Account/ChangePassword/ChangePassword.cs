using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.Account.ChangePassword
{
    public class ChangePassword
    {
        public string LoginID { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
