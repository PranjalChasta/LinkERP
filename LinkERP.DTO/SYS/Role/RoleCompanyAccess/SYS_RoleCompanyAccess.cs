using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.SYS.Role.RoleCompanyAccess
{
    public class SYS_RoleCompanyAccess
    {
        public Guid ID { get; set; }
        public Guid RoleID { get; set; }
        public Guid CompanyID { get; set; }
        public string CompanyCode { get; set; }
        public string Name { get; set; }
        public bool Deleted { get; set; }
    }
}
