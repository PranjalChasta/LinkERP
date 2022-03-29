using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class DocumentTemplateService :IDocumentTemplateService
    {
        IDocumentTemplateRepository  document;
        public DocumentTemplateService(IDocumentTemplateRepository  _document)
        {
            document = _document;
        }

        public string AddDocumentTemplate(LBS_SYS_DocumentTemplate lBS_SYS_DocumentTemplate)
        {
            return document.AddDocumentTemplate(lBS_SYS_DocumentTemplate);
        }
        public string UpdateDocumentTemplate(LBS_SYS_DocumentTemplate lBS_SYS_DocumentTemplate)
        {
            return document.UpdateDocumentTemplate(lBS_SYS_DocumentTemplate);
        }
        public IList<LBS_SYS_DocumentTemplate> GetAllDocumentTemplates(Guid CompanyID)
        {
            return document.GetAllDocumentTemplates(CompanyID);
        }
        public LBS_SYS_DocumentTemplate GetDocumentTemplateByID(Guid ID)
        {
            return document.GetDocumentTemplateByID(ID);
        }
        public bool DeleteDocumentTemplateByID(Guid ID, string DeletedBy)
        {
            return document.DeleteDocumentTemplateByID(ID, DeletedBy);
        }

        public IList<LBS_SYS_DocumentTemplate> GetDocumentByCompanyID(Guid CompanyID)
        {
            return document.GetDocumentByCompanyID(CompanyID);
        }
    }
}
