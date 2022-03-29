using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.DOC.Documents
{
    public class DownloadFile
    {
        public string PhysicalFileName { get; set; }
        public byte[] FileBinary { get; set; }
    }
}
