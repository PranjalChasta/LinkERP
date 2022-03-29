using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface IDocumentTemplateRepository
    {
        string AddDocumentTemplate(LBS_SYS_DocumentTemplate lBS_SYS_DocumentTemplate);
        string UpdateDocumentTemplate(LBS_SYS_DocumentTemplate lBS_SYS_DocumentTemplate);
        IList<LBS_SYS_DocumentTemplate> GetAllDocumentTemplates(Guid CompanyID);
        LBS_SYS_DocumentTemplate GetDocumentTemplateByID(Guid ID);
        bool DeleteDocumentTemplateByID(Guid ID, string DeletedBy);

        IList<LBS_SYS_DocumentTemplate> GetDocumentByCompanyID(Guid CompanyID);
    }
}
