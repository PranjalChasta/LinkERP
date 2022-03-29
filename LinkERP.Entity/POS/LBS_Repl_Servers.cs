using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_Repl_Servers:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string ServerName { get; set; }
        public string DatabaseName { get; set; }
        public string Description { get; set; }
        public string LinkedServerUsername { get; set; }
        public string LinkedServerPassword { get; set; }
        public bool ServerType { get; set; }

    }
}
