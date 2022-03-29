using Dapper;
using LinkERP.DAL.SHARED.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SHARED;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SHARED
{
    public class NoteRepository : BaseRepository, INoteRepository
    {
        public IList<LBS_SYS_Notes> GetNotes()
        {
            List<LBS_SYS_Notes> lBS_SYS_Companies = new List<LBS_SYS_Notes>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RecID", null);
            parameters.Add("@ID", null);
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var companies = con.Query<LBS_SYS_Notes>("SYS_GetAllNotes", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return companies;
        }
        public LBS_SYS_Notes GetNoteByID(Guid ID)
        {
            List<LBS_SYS_Notes> lBS_SYS_Companies = new List<LBS_SYS_Notes>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            var Notes = con.Query<LBS_SYS_Notes>("SYS_GetNoteByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return Notes;
        }
        public string AddNote(LBS_SYS_Notes lBS_SYS_Notes)
        {
            DynamicParameters parameters = new DynamicParameters();

            //parameters.Add("@ID", lBS_SYS_Company.ID);

            parameters.Add("@RecID", lBS_SYS_Notes.RecID);
            parameters.Add("@NoteTypeID", lBS_SYS_Notes.NoteTypeID);
            parameters.Add("@NoteSubject", lBS_SYS_Notes.NoteSubject);
            parameters.Add("@NoteText", lBS_SYS_Notes.NoteText);
            parameters.Add("@NextFollowupDate", lBS_SYS_Notes.NextFollowupDate);
            parameters.Add("@Status", lBS_SYS_Notes.Status);
            parameters.Add("@CreatedBY", lBS_SYS_Notes.CreatedBY);
            parameters.Add("@NoteID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_NotesManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@NoteID");
            return id;
        }
        public string UpdateNote(LBS_SYS_Notes lBS_SYS_Notes)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", lBS_SYS_Notes.ID);
            parameters.Add("@RecID", lBS_SYS_Notes.RecID);
            parameters.Add("@NoteTypeID", lBS_SYS_Notes.NoteTypeID);
            parameters.Add("@NoteSubject", lBS_SYS_Notes.NoteSubject);
            parameters.Add("@NoteText", lBS_SYS_Notes.NoteText);
            parameters.Add("@NextFollowupDate", lBS_SYS_Notes.NextFollowupDate);
            parameters.Add("@Status", lBS_SYS_Notes.Status);
            parameters.Add("@CreatedBY", lBS_SYS_Notes.CreatedBY);
            parameters.Add("@NoteID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
            SqlMapper.Query(con, "SYS_NotesManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@NoteID");
            return id;
        }
        public bool DeleteNoteByID(Guid ID, string DeletedBy)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", ID);
            parameters.Add("@DeletedBy", DeletedBy);

            SqlMapper.Query(con, "SYS_DeleteNoteByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);

            return true;
        }
        public IList<LBS_SYS_NoteTypes> GetNotetype()
        {
            List<LBS_SYS_NoteTypes> lBS_SYS_Companies = new List<LBS_SYS_NoteTypes>();
            var companies = con.Query<LBS_SYS_NoteTypes>("SYS_GetNoteType",
                            commandType: CommandType.StoredProcedure).AsList();
            return companies;
        }

        public IList<LBS_SYS_Notes> GetNoteByRecID(string RecID)
        {
            
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@RecID", RecID);
            parameters.Add("@ID", null);
            parameters.Add("@Action", ActionsForSP.SelectBYRecID.GetDescription());
            var Notes = con.Query<LBS_SYS_Notes>("SYS_GetAllNotes", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return Notes;
            //LBS_SYS_NotesObj _LBS_SYS_NotesObj = new LBS_SYS_NotesObj();
            //using (var multi = con.QueryMultiple("SYS_GetAllNotes", param: parameters,
            //                commandType: CommandType.StoredProcedure))
            //{
            //    _LBS_SYS_NotesObj.LBS_SYS_Notes = multi.Read<LBS_SYS_Notes>();
            //    _LBS_SYS_NotesObj.LBS_SYS_NotesDetail = multi.Read<LBS_SYS_NotesDetail>(); 
            //}
            // return _LBS_SYS_NotesObj;
        }

        public IList<LBS_SYS_NotesDetail> GetNoteDetailByID(Guid ID)
        { 
            DynamicParameters parameters = new DynamicParameters(); 
            parameters.Add("@ID", ID);
            parameters.Add("@Action", "SelectDetailBYID");
            var Notes = con.Query<LBS_SYS_NotesDetail>("SYS_GetAllNotes", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return Notes; 
        }
    }
}
