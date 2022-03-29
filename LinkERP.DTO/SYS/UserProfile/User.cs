using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.SYS.UserProfile
{
    public class User
    {
        public string LoginID { get; set; }
        public string LoginName { get; set; }        
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string MobileNumber { get; set; }
        public string TaxNumber { get; set; }
        public byte[] LoginAvator { get; set; }
    }
}
