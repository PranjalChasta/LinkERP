using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_REPL_ServerRelationship:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid HostServer { get; set; }
        public Guid DestinationServer { get; set; }
        public bool RelationshipType { get; set; }
        public bool Status { get; set; }
        public string RelationshipTypeStatus { get; set; }
        public string ServerName { get; set; }
        public string DatabaseName { get; set; }
        public string Description { get; set; }
        public string Server { get; set; }
    }
}
