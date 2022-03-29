using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_NotesDetail : BaseEntity
    { 
        public Guid NoteID { get; set; }
        public string NoteText { get; set; }
        public DateTime? NextFollowupDate { get; set; }
        public string Status { get; set; } 
        public Guid TypeID { get; set; } 
    }
}
