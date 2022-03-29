using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SOP
{
    public class LBS_SOP_PrescriptionDoctor : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string DoctorName { get; set; }
        public string DoctorShortCode { get; set; }
        public string BusinessPhone { get; set; }
        public string HomePhone { get; set; }
        public string MobileNo { get; set; }
        public string EmergencyNo { get; set; }
        public string Address { get; set; }

    }
}
