using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_UserRoles : BaseEntity
    {
        public string LoginID { get; set; }
        public Guid RoleId { get; set; }
        public LBS_SYS_User LBS_SYS_User { get; set; }
        public LBS_SYS_Role LBS_SYS_Role { get; set; }
        public string RoleName { get; set; }
        public string RoleCode { get; set; }
    }
}
