using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.DOC.Documents
{
    public class DocumentAttributes
    {
        public Guid? ID { get; set; }
        public Guid AttributeID { get; set; }
        public string AttributeCode { get; set; }
        public string AttributeName { get; set; }
        public string AttributeValue { get; set; }
        public string DeleteStatus { get; set; }

    }
}
