using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.SYS.User.ResetPassword
{
    public class UserDetails
    {
        public string LoginID { get; set; }
        public string LoginName { get; set; }
        public string Password { get; set; } 
        public string EmailAddress { get; set; }       
        public string MobileNumber { get; set; }
    }
}
