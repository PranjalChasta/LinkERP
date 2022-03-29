using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.PUR.QuoteAnalysis
{
    public class LBS_PUR_SubmitRequest
    {
        public Guid RequisitionID { get; set; }
        public Guid VendorID { get; set; }
        public string VendorName { get; set; }
        public string EmailAddress { get; set; }
    }
}
