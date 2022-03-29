using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.DOC
{
    public class LBS_DOC_Documents : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid RoleAccessGroup { get; set; }
        public byte[] FileBinary { get; set; }
        public string Description { get; set; }
        public string PhysicalFileName { get; set; }
        public Guid CategoryID { get; set; }
        public Guid SubCategoryID { get; set; }
    }
}
