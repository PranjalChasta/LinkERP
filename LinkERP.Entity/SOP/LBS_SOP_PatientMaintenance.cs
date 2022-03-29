using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SOP
{
    public class LBS_SOP_PatientMaintenance : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string PatientName { get; set; }
        public string HomePhone { get; set; }
        public string MobileNo { get; set; }
        public string Address { get; set; }
        public string EmailAddress { get; set; }
        public string GenderType { get; set; }
        public string EmergencyContactNumber { get; set; }
        public string EmergencyContactName { get; set; }
        public DateTime? PatientDOB { get; set; }
        public string Weight { get; set; }
        public string Family { get; set; }
        public Guid? Insurer { get; set; }
        public string UsualDoctor { get; set; }
        public string PatientAllergies { get; set; }
        public bool PromptWarningNotes { get; set; }
        public string WarningNotes { get; set; }
        public bool Deceased { get; set; }
    }
}
