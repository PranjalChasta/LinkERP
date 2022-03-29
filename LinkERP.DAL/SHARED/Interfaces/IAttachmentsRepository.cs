using LinkERP.Entity.SHARED;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SHARED.Interfaces
{
    public interface IAttachmentsRepository
    {
        IList<LBS_SYS_Attachments> GetAllAttachments();
        IList<LBS_SYS_Attachments> GetAllAttachmentsByRecID(string RecID);
        string AddAttachments(IList<LBS_SYS_Attachments> lBS_SYS_Attachments);

        bool DeleteAttachmentsBYID(Guid ID, string DeletedBy);
        LBS_SYS_Attachments GetAttachmentByID(Guid ID);
    }
}
