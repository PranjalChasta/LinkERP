using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SOP
{
    public class LBS_SOP_PrescriptionInstructions:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid InstructionGroup { get; set; }
        public string InstructionCode { get; set; }
        public string InstructionDescription { get; set; }

    }
}
