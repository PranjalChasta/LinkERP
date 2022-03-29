using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SOP
{
    public class LBS_SOP_NonPrescriptionLabels:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid MedicationName { get; set; }
        public string Instructions { get; set; }
        public DateTime ExpiryDate { get; set; }
        public decimal Price { get; set; }
        public int NumberOfCopies { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }


    }
}
