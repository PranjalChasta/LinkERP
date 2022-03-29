using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_RoleCompanyAccess : BaseEntity
    {
        public Guid RoleID { get; set; }
        public Guid CompanyID { get; set; }
        public LBS_SYS_Company LBS_SYS_Company { get; set; }
        public LBS_SYS_Role LBS_SYS_Role { get; set; }
    }
}
