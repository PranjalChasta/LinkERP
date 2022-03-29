

using LinkERP.Entity.DOC;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.DOC.Documents
{
    public class DocumentDetails
    {
        public LBS_DOC_Documents LBS_DOC_Documents { get; set; }
        public IList<DocumentAttributes> DocumentAttributes { get; set; }
    }
}
