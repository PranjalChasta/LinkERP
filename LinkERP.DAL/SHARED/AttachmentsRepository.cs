using Dapper;
using LinkERP.DAL.SHARED.Interfaces;
using LinkERP.Entity.SHARED;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SHARED
{
    public class AttachmentsRepository : BaseRepository, IAttachmentsRepository
    {
        
        public IList<LBS_SYS_Attachments> GetAllAttachments()
        {
            List<LBS_SYS_Attachments> lBS_SYS_Attachments = new List<LBS_SYS_Attachments>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var attachments = con.Query<LBS_SYS_Attachments>("SYS_AttachmentsManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return attachments;
        }

        public IList<LBS_SYS_Attachments> GetAllAttachmentsByRecID(string RecID)
        {
            List<LBS_SYS_Attachments> lBS_SYS_Attachments = new List<LBS_SYS_Attachments>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", ActionsForSP.SelectBYRecID.GetDescription());
            parameters.Add("@RecID", RecID.ToString());
            var attachments = con.Query<LBS_SYS_Attachments>("SYS_AttachmentsManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return attachments;
        }
        public string AddAttachments(IList<LBS_SYS_Attachments> lBS_SYS_Attachments)
        {
            var Result = "";
            DynamicParameters parameters = new DynamicParameters(); 
            
            foreach (var _LBS_SYS_AttachmentFiles in lBS_SYS_Attachments)
            {
                parameters.Add("@ID", _LBS_SYS_AttachmentFiles.ID);
                parameters.Add("@RecID", _LBS_SYS_AttachmentFiles.RecID);
                parameters.Add("@PhysicalFileName", _LBS_SYS_AttachmentFiles.PhysicalFileName);
                parameters.Add("@FileBinary", _LBS_SYS_AttachmentFiles.FileBinary);
                parameters.Add("@FileType", _LBS_SYS_AttachmentFiles.FileType);
                if (lBS_SYS_Attachments.FirstOrDefault().ID == null)
                {
                    parameters.Add("@Action", ActionsForSP.Add.GetDescription());
                }
                else
                {
                    parameters.Add("@Action", ActionsForSP.Edit.GetDescription());
                }
                parameters.Add("@Size", _LBS_SYS_AttachmentFiles.Size);
                parameters.Add("@Description", _LBS_SYS_AttachmentFiles.Description);
                parameters.Add("@CreatedBY", _LBS_SYS_AttachmentFiles.CreatedBY);
                // parameters.Add("@AttachmentID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
                SqlMapper.Query(con, "SYS_AttachmentsManagement",
                                param: parameters,
                                commandType: CommandType.StoredProcedure);
                //id = parameters.Get<string>("@AttachmentID");
                Result = "Success";
            }
            return Result;
        }


        public bool DeleteAttachmentsBYID(Guid ID, string DeletedBy)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@DeletedBy", DeletedBy);
            parameters.Add("@Action", ActionsForSP.Delete.GetDescription());
            SqlMapper.Query(con, "SYS_AttachmentsManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);

            return true;
        }

        public LBS_SYS_Attachments GetAttachmentByID(Guid ID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var workFlow = con.Query<LBS_SYS_Attachments>("SYS_AttachmentsManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return workFlow;
        }
    }
}

