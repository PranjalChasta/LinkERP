using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_RoleCompanyPayTeamAccess : BaseEntity
    {
        public Guid RoleID { get; set; }
        public Guid CompanyID { get; set; }
        public Guid PayTeamId { get; set; }
    }
}
