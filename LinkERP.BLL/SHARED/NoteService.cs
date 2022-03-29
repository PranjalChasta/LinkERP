using LinkERP.BLL.SHARED.Interfaces;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SHARED.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SHARED;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SHARED
{
  public   class NoteService: INoteService
    {
        INoteRepository note;
        public NoteService(INoteRepository _note)
        {
            note = _note;
        }

        public string AddNote(LBS_SYS_Notes lBS_SYS_Notes)
        {
            return note.AddNote(lBS_SYS_Notes);
        }

        public bool DeleteNoteByID(Guid ID, string DeletedBy)
        {
            return note.DeleteNoteByID(ID, DeletedBy);
        }

        public IList<LBS_SYS_Notes> GetNotes()
        {
            return note.GetNotes();
        }

        public LBS_SYS_Notes GetNoteByID(Guid ID)
        {
            return note.GetNoteByID(ID);
        }

        public string UpdateNote(LBS_SYS_Notes lBS_SYS_Notes)
        {
            return note.UpdateNote(lBS_SYS_Notes);
        }


        public IList<LBS_SYS_NoteTypes> GetNotetype()
        {
            return note.GetNotetype();
        }

        //public LBS_SYS_NoteTypes GetNotetypeByID(Guid ID)
        //{
        //    return note.GetNotetypeByID(ID);
        //}

        public IList<LBS_SYS_Notes> GetNoteByRecID(string RecID)
        {
            return note.GetNoteByRecID(RecID);
        }

        public IList<LBS_SYS_NotesDetail> GetNoteDetailByID(Guid ID)
        {
            return note.GetNoteDetailByID(ID);
        }
    }
}
