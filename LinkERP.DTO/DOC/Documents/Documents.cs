using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.DOC.Documents
{
    public class Documents
    {
        public Guid ID { get; set; }
        public string FileName { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string SubCategory { get; set; }
        public string RoleName { get; set; }
        public string DeleteStatus { get; set; }
        public bool Deleted { get; set; }
    }
}
