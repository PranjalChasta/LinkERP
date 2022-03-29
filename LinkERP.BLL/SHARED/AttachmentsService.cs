using LinkERP.BLL.SHARED.Interfaces;
using LinkERP.DAL.SHARED.Interfaces;
using LinkERP.Entity.SHARED;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SHARED
{
    public class AttachmentsService : IAttachmentsService
    {
        IAttachmentsRepository attachments;
        public AttachmentsService(IAttachmentsRepository _attachments)
        {
            attachments = _attachments;
        }
        public IList<LBS_SYS_Attachments> GetAllAttachments()
        {
            return attachments.GetAllAttachments();
        }
        public IList<LBS_SYS_Attachments> GetAllAttachmentsByRecID(string RecID)
        {
            return attachments.GetAllAttachmentsByRecID(RecID);
        }
        public string AddAttachments(IList<LBS_SYS_Attachments> lBS_SYS_Attachments)
        {
            return attachments.AddAttachments(lBS_SYS_Attachments);
        } 
        public bool DeleteAttachmentsBYID(Guid ID, string DeletedBy)
        {
            return attachments.DeleteAttachmentsBYID(ID, DeletedBy);
        }
        public LBS_SYS_Attachments GetAttachmentByID(Guid ID)
        {
            return attachments.GetAttachmentByID(ID);
        }
    }
}
