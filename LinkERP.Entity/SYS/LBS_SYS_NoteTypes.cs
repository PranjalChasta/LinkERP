using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_NoteTypes :BaseEntity
    {
        public string NoteTypeName { get; set; }
        public Guid CompanyID { get; set; }
        
    }
}
