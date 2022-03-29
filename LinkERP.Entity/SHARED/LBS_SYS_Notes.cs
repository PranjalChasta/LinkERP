using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SHARED
{
 public  class LBS_SYS_Notes :BaseEntity
    {
        public string RecID { get; set; }
        public Guid NoteTypeID { get; set; }
        public String NoteText { get; set; }
       //public decimal LineNo { get; set; }
        public DateTime? NextFollowupDate { get; set; }
        public string Status { get; set; }
        public string NoteTypeName { get; set; }
        public Guid TypeID { get; set; } 
        public string NoteSubject { get; set; }  
    }

    public class LBS_SYS_NotesObj
    {
        public object LBS_SYS_Notes { get; set; }
        public object LBS_SYS_NotesDetail { get; set; } 
    }
}
