using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_Module
    {
        public string ID { get; set; }
        public string ModuleName { get; set; }
        public string LicenseId { get; set; }
        public int UserCount { get; set; }
        public DateTime ExpiryDate { get; set; }
    }
}
