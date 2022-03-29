using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SHARED
{
    public class LBS_SYS_Attachments : BaseEntity
    {
        public string RecID { get; set; }
        public string Description { get; set; }
        public string PhysicalFileName { get; set; }
        public string FileBinary { get; set; }
        public string Size { get; set; }
        public string FileType { get; set; } 
      //  public List<LBS_SYS_AttachmentFiles> LBS_SYS_AttachmentFiles { get; set; }

    }
}
