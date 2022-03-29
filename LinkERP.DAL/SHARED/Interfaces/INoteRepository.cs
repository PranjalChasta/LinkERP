using LinkERP.Entity.SHARED;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SHARED.Interfaces
{
    public interface INoteRepository
    {
        string AddNote(LBS_SYS_Notes lBS_SYS_Notes);
        string UpdateNote(LBS_SYS_Notes lBS_SYS_Notes);
        IList<LBS_SYS_Notes> GetNotes();
        LBS_SYS_Notes GetNoteByID(Guid ID);
        bool DeleteNoteByID(Guid ID, string DeletedBy);

        IList<LBS_SYS_NoteTypes> GetNotetype();

        IList<LBS_SYS_Notes> GetNoteByRecID(string RecID);
        IList<LBS_SYS_NotesDetail> GetNoteDetailByID(Guid ID);
        // LBS_SYS_NoteTypes GetNotetypeByID(Guid ID);
    }
}
